/** Minimum star rating shown in the UI (always above 4.0 for new tutors). */
export const MIN_TUTOR_DISPLAY_RATING = 4.2;

/** Default when a tutor has no reviews yet. */
export const DEFAULT_NEW_TUTOR_DISPLAY_RATING = 4.8;

/**
 * Maps stored ratingAvg to a display value. Real ratings above 4 are kept;
 * missing or low values are bumped so new tutors still show a strong rating.
 */
export function displayTutorRating(ratingAvg?: number | null): number {
  const raw = ratingAvg ?? 0;
  if (raw <= 0) return DEFAULT_NEW_TUTOR_DISPLAY_RATING;
  if (raw <= 4) return MIN_TUTOR_DISPLAY_RATING;
  return Math.min(5, raw);
}
