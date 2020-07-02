import { useLocation } from "@reach/router";
import React, { useEffect, useRef } from "react";

export const OnNavigate: React.FunctionComponent<{
  onComplete?: () => void;
}> = (props) => {
  const onComplete = useRef(props.onComplete);
  onComplete.current = props.onComplete;

  const location = useLocation();

  useEffect(() => {
    if (onComplete.current) {
      onComplete.current();
    }
  }, [location]);

  return null;
};
