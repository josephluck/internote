import { styled } from "../theming/styled";
import { spacing, size, font, media } from "../theming/symbols";
import { valueToOutline } from "../utilities/editor";
import { Value, Node } from "slate";

const Wrap = styled.div`
  position: sticky;
  left: 0;
  top: 0;
  height: 100%;
  overflow: auto;
  width: ${size.outlineWidth};
  padding-right: ${spacing._2};
  opacity: 0.2;
  transition: all 333ms ease;
  padding-bottom: ${spacing._1};
  @media (min-width: ${media.tablet}) {
    padding-right: ${spacing._3};
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
  onItemClick
}: {
  value: Value;
  onItemClick: (node: Node) => any;
}) {
  const structure = valueToOutline(value);
  return (
    <Wrap>
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
