export type TouchPoint = { x: number; y: number };

export const EDGE_START_MAX_PX = 24;
export const EDGE_SWIPE_MIN_PX = 72;
export const TOP_EXIT_MAX_PX = 24;
export const TOP_EXIT_MIN_DEPTH_PX = 160;

/**
 * A rightward swipe that starts at the browser's left edge is the only safe
 * advance signal we can observe for a mobile back attempt without adding or
 * replacing history entries. The vertical tolerance rejects normal scrolling.
 */
export function isEdgeBackGesture(
  start: TouchPoint,
  current: TouchPoint,
): boolean {
  const horizontal = current.x - start.x;
  const vertical = Math.abs(current.y - start.y);

  return (
    start.x <= EDGE_START_MAX_PX &&
    horizontal >= EDGE_SWIPE_MIN_PX &&
    vertical <= Math.max(40, horizontal / 2)
  );
}

/**
 * Treat reaching the top while moving upward as exit intent only after the
 * visitor has explored a meaningful portion of the page.
 */
export function isTopExitScroll(
  maxScrollY: number,
  previousScrollY: number,
  currentScrollY: number,
): boolean {
  return (
    maxScrollY >= TOP_EXIT_MIN_DEPTH_PX &&
    currentScrollY <= TOP_EXIT_MAX_PX &&
    currentScrollY < previousScrollY
  );
}
