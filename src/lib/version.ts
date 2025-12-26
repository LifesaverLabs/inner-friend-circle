/**
 * Application Version
 *
 * Single source of truth: package.json
 * Injected at build time via Vite's define config.
 */

// Declared in vite.config.ts via define option
declare const __APP_VERSION__: string;

/**
 * The current application version, read from package.json at build time.
 * Format: "major.minor.patch-prerelease" (e.g., "0.1.14-alpha-unstable")
 */
export const APP_VERSION: string = __APP_VERSION__;

/**
 * Display-friendly version string with 'v' prefix.
 * Example: "v0.1.14-alpha-unstable"
 */
export const FULL_VERSION: string = `v${__APP_VERSION__}`;

/**
 * Parse version components from the version string.
 * Example: "0.1.14-alpha-unstable" -> { major: 0, minor: 1, patch: 14, prerelease: "alpha-unstable" }
 */
export function parseVersion(version: string = APP_VERSION): {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
} {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) {
    return { major: 0, minor: 0, patch: 0 };
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
  };
}

/**
 * Check if the current version is a pre-release (alpha, beta, rc, etc.)
 */
export function isPrerelease(version: string = APP_VERSION): boolean {
  return version.includes('-');
}

/**
 * Get a display-friendly version string.
 * Example: "v0.1.14-alpha-unstable"
 */
export function getDisplayVersion(version: string = APP_VERSION): string {
  return `v${version}`;
}
