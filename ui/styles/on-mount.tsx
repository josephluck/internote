import { useEffect } from "react";

export function OnMount({ cb }: { cb: () => any }) {
  useEffect(() => {
    cb();
  }, []);
  return null;
}
