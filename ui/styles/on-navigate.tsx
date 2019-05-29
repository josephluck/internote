import * as React from "react";
import routerEvents from "next-router-events";

export function OnNavigate({
  onComplete,
  onStart
}: {
  onComplete?: () => void;
  onStart?: () => void;
}) {
  React.useEffect(() => {
    if (onComplete) {
      routerEvents.on("routeChangeComplete", onComplete);
    }
    if (onStart) {
      routerEvents.on("routeChangeStart", onStart);
    }
    return function() {
      if (onComplete) {
        routerEvents.off("routeChangeComplete", onComplete);
      }
      if (onStart) {
        routerEvents.off("routeChangeStart", onStart);
      }
    };
  });
  return null;
}
