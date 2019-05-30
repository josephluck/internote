import { styled } from "../theming/styled";
import { spacing, size, font, media } from "../theming/symbols";
import { valueToOutline } from "../utilities/editor";
import { Value, Node } from "slate";

const Wrap = styled.div<{ showing: boolean }>`
  position: sticky;
  right: 0;
  top: 0;
  height: 100%;
  overflow: auto;
  width: ${size.outlineWidth};
  padding-left: ${spacing._1};
  transition: all 333ms ease;
  text-align: right;
  padding-bottom: ${spacing._1};
  opacity: ${props => (props.showing ? 0.2 : 0)};
  margin-right: ${props => (props.showing ? 0 : `-${size.outlineWidth}`)};
  @media (min-width: ${media.tablet}) {
    padding-left: ${spacing._2};
  }
  &:hover {
    opacity: 1;
  }
`;

const OutlineItemWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const OutlineHeadingOne = styled.p`
  margin: ${spacing._1} 0 ${spacing._0_25};
  font-weight: bold;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OutlineHeadingTwo = styled.p`
  margin: ${spacing._0_125} 0;
  opacity: 0.7;
  font-weight: 500;
  font-size: ${font._16.size};
  line-height: ${font._16.lineHeight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export function Outline({
  value,
  onItemClick,
  showing
}: {
  value: Value;
  onItemClick: (node: Node) => any;
  showing: boolean;
}) {
  const structure = valueToOutline(value);
  return (
    <Wrap showing={showing}>
      {structure.map(block => (
        <OutlineItemWrapper
          key={block.key}
          onClick={() => onItemClick(block.node)}
        >
          {block.type === "heading-one" ? (
            <OutlineHeadingOne>{block.name}</OutlineHeadingOne>
          ) : (
            <OutlineHeadingTwo>{block.name}</OutlineHeadingTwo>
          )}
        </OutlineItemWrapper>
      ))}
    </Wrap>
  );
}
