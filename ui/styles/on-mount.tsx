import * as React from "react";

export function OnMount({ cb }: { cb: () => any }) {
  React.useEffect(() => {
    cb();
  });
  return null;
}
