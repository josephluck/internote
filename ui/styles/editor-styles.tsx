import { styled } from "../theming/styled";
import { spacing, borderRadius, font } from "../theming/symbols";
import { Editor as SlateEditor } from "slate-react";
import { Wrapper } from "./wrapper";

export const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

export const EditorStyles = styled.div<{
  distractionFree: boolean;
  userScrolled: boolean;
}>`
  display: flex;
  flex: 1;
  overflow: auto;
  font-family: ${props => props.theme.fontFamily};
  strong {
    font-weight: bold;
  }
  i,
  em {
    font-style: italic;
  }
  u {
    text-decoration: underline;
  }
  code {
    font-family: monospace;
    background: ${props => props.theme.codeBlockBackground};
    padding: ${spacing._0_125} ${spacing._0_25};
    border-radius: ${borderRadius._6};
    padding-bottom: 0;
    display: inline-block;
  }
  h1 {
    font-size: ${font._36.size};
    line-height: ${font._36.lineHeight};
    font-weight: bold;
  }
  h2 {
    font-size: ${font._28.size};
    line-height: ${font._28.lineHeight};
    font-weight: bold;
  }
  ul li,
  ol li {
    list-style-position: inside;
    margin-bottom: ${spacing._0_5};
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  ul {
    li {
      list-style-type: disc;
    }
  }
  ol {
    li {
      list-style-type: decimal;
    }
  }
  blockquote {
    border-left: solid 4px ${props => props.theme.blockQuoteBorder};
    padding-left: ${spacing._0_5};
  }
  .node-unfocused {
    opacity: ${props =>
      props.distractionFree && !props.userScrolled ? 0.2 : 1};
    transition: all 300ms ease;
  }
  .node-focused {
    opacity: 1;
    transition: all 100ms ease;
  }
`;

export const EditorInnerWrap = styled(Wrapper)`
  display: flex;
  flex: 1;
  overflow: auto;
`;

export const TextEditorWrap = styled.div`
  flex: 1;
`;

export const Editor = styled(SlateEditor)<{ distractionFree: boolean }>`
  padding-top: ${props => (props.distractionFree ? "50vh" : 0)};
  padding-bottom: ${props => (props.distractionFree ? "50vh" : spacing._1)};
`;
