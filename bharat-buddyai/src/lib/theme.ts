// Tiny dark-mode helper (no provider needed).
export function applyTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("bb-theme", dark ? "dark" : "light");
  } catch {
    // ignore quota / privacy errors
  }
}

export function initThemeFromStorage() {
  if (typeof document === "undefined") return;
  try {
    const v = localStorage.getItem("bb-theme");
    if (v === "dark") document.documentElement.classList.add("dark");
  } catch {
    // ignore
  }
}
