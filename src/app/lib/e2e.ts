/**
 * Capacitor WKWebView E2E attributes.
 * - data-testid / id: for DOM tooling (not visible to Maestro on iOS WKWebView)
 * - aria-label: human-readable name for VoiceOver AND Maestro `text:` selectors
 *
 * Maestro on this app matches accessibilityText from aria-label. Machine-only
 * hooks (title, aria-describedby, sr-only test ids) do not surface in the hierarchy.
 */
export function e2e(testId: string, accessibleName: string) {
  return {
    "data-testid": testId,
    id: testId,
    "aria-label": accessibleName,
  } as const;
}
