const ACCESS_TOKEN_KEY = "access_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function putAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function apiRequest(
  path,
  { method = "GET", body, auth = true } = {}
) {
  const headers = {};
  let payload;

  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    headers.Authorization = `Bearer ${getAccessToken()}`;
  }

  const response = await fetch(`${DELCOM_BASEURL}${path}`, {
    method,
    headers,
    body: payload,
  });

  return response.json();
}
