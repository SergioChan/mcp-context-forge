// ===================================================================
// PROXY-AWARE ADMIN NAVIGATION
// Derives admin base from window.location so that proxy-embedded
// deployments (where window.ROOT_PATH may be empty) preserve the
// proxy prefix in the navigated URL. Fixes #3321 and #3324.
// ===================================================================

/**
 * Navigate to an admin tab while preserving the proxy prefix in the URL.
 *
 * Derives the admin base path from window.location.pathname rather than
 * window.ROOT_PATH, so that proxy-embedded deployments (where ASGI
 * root_path is not forwarded and ROOT_PATH is empty) still navigate to
 * the correct proxy-scoped URL.
 *
 * @param {string} fragment - Hash fragment without '#' (e.g. "tools", "catalog").
 * @param {URLSearchParams} [searchParams] - Query params to include (team_id, include_inactive, etc.).
 */
export const navigateAdmin = function (fragment, searchParams) {
  const currentPath = window.location.pathname;
  // Find /admin in current path and use everything before it as the base.
  // e.g. /api/proxy/mcp/admin → base is /api/proxy/mcp
  // Use lastIndexOf so that path segments like /administrator don't match.
  const adminIdx = currentPath.lastIndexOf("/admin");
  const base =
    adminIdx >= 0
      ? window.location.origin + currentPath.slice(0, adminIdx)
      : window.ROOT_PATH || window.location.origin;
  const qs = searchParams ? searchParams.toString() : "";
  window.location.href = `${base}/admin${qs ? `?${qs}` : ""}#${fragment}`;
};
