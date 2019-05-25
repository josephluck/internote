import { styled } from "../theming/styled";
import { spacing, size, font, media } from "../theming/symbols";
import { BlockType } from "../utilities/serializer";

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

interface Structure {
  name: string;
  type: BlockType;
}

// TODO: single line bold
const outlineOrdering: BlockType[] = ["heading-one", "heading-two"];

function contentToStructure(content: any[]): Structure[] {
  return content
    .filter(
      node => node.object === "block" && outlineOrdering.includes(node.type)
    )
    .filter(
      block =>
        !!block.nodes && !!block.nodes.length && !!block.nodes[0].text.length
    )
    .map(block => ({
      name: block.nodes[0].text,
      type: block.type
    }));
}

export function Outline({ content }: { content: any[] }) {
  const structure = contentToStructure(content);
  return (
    <Wrap>
      {structure.map(block => (
        <OutlineItemWrapper key={block.name}>
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
