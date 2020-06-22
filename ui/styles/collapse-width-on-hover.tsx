import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Motion, spring } from "react-motion";
import styled from "styled-components";

const Wrapper = styled.div`
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
`;

const InnerWrap = styled.div``;

// Inline block necessary to recompute width on content change
const CollapsedContent = styled.div`
  display: inline-block;
`;

interface RenderProps {
  renderCollapsedContent: () => ReactNode;
}

export function CollapseWidthOnHover({
  className,
  children,
  onClick,
  onMouseDown,
  collapsedContent,
  forceShow,
}: {
  children: (renderProps: RenderProps) => ReactNode;
  collapsedContent: ReactNode;
  forceShow?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseDown?: (event: React.MouseEvent) => void;
}) {
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const collapsedContentRef = useRef<HTMLDivElement>();

  useEffect(() => {
    function handleWidth() {
      const refsExist = collapsedContentRef.current;
      if (refsExist) {
        if (isHovering || forceShow) {
          const childElm = collapsedContentRef.current.firstChild as any;
          const width = childElm.scrollWidth;
          setWidth(width);
          setOpacity(1);
        } else {
          setWidth(0);
          setOpacity(0);
        }
      }
    }
    requestAnimationFrame(handleWidth);
  }, [collapsedContentRef, isHovering, collapsedContent]);

  const onHoverIn = () => setIsHovering(true);
  const onHoverOut = () => setIsHovering(false);

  const renderCollapsedContent = () => (
    <Motion style={{ width: spring(width), opacity: spring(opacity) }}>
      {(value) => (
        <InnerWrap
          style={{
            width: value.width,
            opacity: value.opacity,
            pointerEvents: width > 0 ? "auto" : "none",
          }}
        >
          <CollapsedContent ref={collapsedContentRef}>
            {collapsedContent}
          </CollapsedContent>
        </InnerWrap>
      )}
    </Motion>
  );

  return (
    <Wrapper
      className={className}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children({ renderCollapsedContent })}
    </Wrapper>
  );
}
