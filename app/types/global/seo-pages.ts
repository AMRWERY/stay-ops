export interface UseSeoPageOptions {
  /** Page title (reactive getter). Brand suffix already baked into i18n keys. */
  title: () => string
  /** Page description (reactive getter). 150–160 chars, unique per page. */
  description: () => string
  /**
   * Set to true for auth / account flows that must not be indexed.
   * Applies robots = "noindex, nofollow" and skips OG / canonical tags.
   */
  private?: boolean
}
