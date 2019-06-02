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

// Inline block necessary to recompute width on content change
const CollapsedContent = styled.div`
  display: inline-block;
`;

interface RenderProps {
  renderCollapsedContent: () => React.ReactNode;
}

export function CollapseWidthOnHover({
  className,
  children,
  onClick,
  collapsedContent,
  forceShow
}: {
  children: (renderProps: RenderProps) => React.ReactNode;
  collapsedContent: React.ReactNode;
  forceShow?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const [isHovering, setIsHovering] = React.useState(false);
  const innerWrapRef = React.useRef<HTMLDivElement>();
  const collapsedContentRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    function handleWidth() {
      const refsExist = innerWrapRef.current && collapsedContentRef.current;
      if (refsExist) {
        if (isHovering || forceShow) {
          const childElm = collapsedContentRef.current.firstChild as any;
          const width = childElm.scrollWidth;
          innerWrapRef.current.style.width = `${width}px`;
          innerWrapRef.current.style.opacity = "1";
          innerWrapRef.current.style.pointerEvents = "auto";
        } else {
          innerWrapRef.current.style.width = "0px";
          innerWrapRef.current.style.opacity = "0";
          innerWrapRef.current.style.pointerEvents = "none";
        }
      }
    }

    window.requestAnimationFrame(handleWidth);
  }, [innerWrapRef, collapsedContentRef, isHovering, collapsedContent]);

  const onHoverIn = () => setIsHovering(true);
  const onHoverOut = () => setIsHovering(false);

  const renderCollapsedContent = () => (
    <InnerWrap ref={innerWrapRef}>
      <CollapsedContent ref={collapsedContentRef}>
        {collapsedContent}
      </CollapsedContent>
    </InnerWrap>
  );

  return (
    <Wrapper
      className={className}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      onClick={onClick}
    >
      {children({ renderCollapsedContent })}
    </Wrapper>
  );
}
