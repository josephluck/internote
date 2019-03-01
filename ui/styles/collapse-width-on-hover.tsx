import * as React from "react";
import { styled } from "../theming/styled";

const Wrapper = styled.div`
  cursor: ${props => (props.onClick ? "pointer" : "default")};
`;

const InnerWrap = styled.div`
  transition: all 300ms ease;
  width: 0;
  opacity: 0;
`;

const CollapsedContent = styled.div``;

interface RenderProps {
  renderCollapsedContent: () => React.ReactNode;
}

interface Props {
  children: (renderProps: RenderProps) => React.ReactNode;
  collapsedContent: React.ReactNode;
  forceShow?: boolean;
  className?: string;
  onClick?: () => void;
}

interface State {
  isHovering: boolean;
}

export class CollapseWidthOnHover extends React.Component<Props, State> {
  collapsedContentRef: React.RefObject<HTMLDivElement>;
  innerWrapRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      isHovering: false
    };
    this.collapsedContentRef = React.createRef();
    this.innerWrapRef = React.createRef();
  }

  componentDidUpdate() {
    window.requestAnimationFrame(this.handleWidth);
  }

  handleWidth = () => {
    const refsExist =
      this.innerWrapRef.current && this.collapsedContentRef.current;
    if (refsExist) {
      if (this.state.isHovering || this.props.forceShow) {
        const childElm = this.collapsedContentRef.current.firstChild as any;
        const width = childElm.scrollWidth;
        this.innerWrapRef.current.style.width = `${width}px`;
        this.innerWrapRef.current.style.opacity = "1";
      } else {
        this.innerWrapRef.current.style.width = "0px";
        this.innerWrapRef.current.style.opacity = "0";
      }
    }
  };

  onHoverIn = () => {
    this.setState({ isHovering: true });
  };

  onHoverOut = () => {
    this.setState({ isHovering: false });
  };

  renderCollapsedContent = () => {
    return (
      <InnerWrap ref={this.innerWrapRef}>
        <CollapsedContent ref={this.collapsedContentRef}>
          {this.props.collapsedContent}
        </CollapsedContent>
      </InnerWrap>
    );
  };

  render() {
    const { className, children, onClick } = this.props;
    return (
      <Wrapper
        className={className}
        onMouseEnter={this.onHoverIn}
        onMouseLeave={this.onHoverOut}
        onClick={onClick}
      >
        {children({ renderCollapsedContent: this.renderCollapsedContent })}
      </Wrapper>
    );
  }
}
