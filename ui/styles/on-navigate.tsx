import * as React from "react";
import routerEvents from "next-router-events";

interface Props {
  onComplete?: () => void;
  onStart?: () => void;
}

export class OnNavigate extends React.Component<Props, {}> {
  componentDidMount() {
    if (this.props.onComplete) {
      routerEvents.on("routeChangeComplete", this.props.onComplete);
    }
    if (this.props.onStart) {
      routerEvents.on("routeChangeStart", this.props.onStart);
    }
  }

  componentWillUnmount() {
    if (this.props.onComplete) {
      routerEvents.off("routeChangeComplete", this.props.onComplete);
    }
    if (this.props.onStart) {
      routerEvents.off("routeChangeStart", this.props.onStart);
    }
  }

  render() {
    return <></>;
  }
}
