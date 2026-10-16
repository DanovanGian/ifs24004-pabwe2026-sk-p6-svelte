import Swal from "sweetalert2";

const PRIMARY_COLOR = "#4f46e5";

export function showSuccessDialog(message) {
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: PRIMARY_COLOR,
  });
}

export function showErrorDialog(message) {
  return Swal.fire({
    icon: "error",
    title: "Gagal",
    text: message,
    confirmButtonColor: PRIMARY_COLOR,
  });
}

export function showWarningDialog(message) {
  return Swal.fire({
    icon: "warning",
    title: "Perhatian",
    text: message,
    confirmButtonColor: PRIMARY_COLOR,
  });
}

export async function showConfirmDialog(message, confirmText = "Ya") {
  const result = await Swal.fire({
    icon: "question",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: PRIMARY_COLOR,
  });

  return result.isConfirmed;
}

export function formatDate(value) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}