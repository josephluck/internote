import routerEvents from "next-router-events";
import { useEffect } from "react";

export function OnNavigate({
  onComplete,
  onStart,
}: {
  onComplete?: () => void;
  onStart?: () => void;
}) {
  useEffect(() => {
    if (onComplete) {
      routerEvents.on("routeChangeComplete", onComplete);
    }
    if (onStart) {
      routerEvents.on("routeChangeStart", onStart);
    }
    return function () {
      if (onComplete) {
        routerEvents.off("routeChangeComplete", onComplete);
      }
      if (onStart) {
        routerEvents.off("routeChangeStart", onStart);
      }
    };
  }, []);
  return null;
}
