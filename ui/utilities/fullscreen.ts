/**
 * Opens fullscreen mode on a given element.
 *
 * NB: Browsers will reject this behavior if called
 * without originating from a user interaction such as
 * a click event:
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 */
export function requestFullScreen(elm: HTMLElement, cb?: () => any) {
  const fn =
    elm.requestFullscreen ||
    (elm as any).msRequestFullScreen ||
    (elm as any).mozRequestFullScreen ||
    (elm as any).webkitRequestFullscreen;
  if (typeof fn === "function") {
    fn.call(elm);
    if (cb) {
      cb();
    }
  }
}

/**
 * Exits fullscreen mode.
 */
export function exitFullscreen(cb?: () => any) {
  const fn =
    document.exitFullscreen ||
    (document as any).msExitFullscreen ||
    (document as any).mozCancelFullScreen ||
    (document as any).webkitExitFullscreen;

  if (typeof fn === "function") {
    fn.call(document);
    if (cb) {
      cb();
    }
  }
}
