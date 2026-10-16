import { render } from "@testing-library/svelte";

export function renderWithProviders(Component, options = {}) {
  return render(Component, options);
}