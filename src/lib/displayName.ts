const STORAGE_KEY = "jab_display_name";

export function getDisplayName(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setDisplayName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, name.trim());
  } catch {
    // localStorage unavailable
  }
}
