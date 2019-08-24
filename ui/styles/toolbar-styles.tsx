import styled from "styled-components";
import { font, spacing, size } from "../theming/symbols";
import { Wrapper } from "./wrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faCode,
  faHeading,
  faQuoteLeft,
  faListUl,
  faListOl,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import {
  SchemaMarkType,
  SchemaBlockType
} from "@internote/export-service/types";

export const ToolbarWrapper = styled.div<{
  distractionFree: boolean;
  forceShow: boolean;
}>`
  flex: 0 0 auto;
  font-size: ${font._18.size};
  line-height: ${font._18.lineHeight};
  background: ${props => props.theme.toolbarBackground};
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: ${spacing._0_25} 0;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 500ms ease;
  opacity: ${props => (props.distractionFree && !props.forceShow ? 0 : 1)};
  transform: ${props =>
    props.distractionFree && !props.forceShow
      ? "translateY(5px)"
      : "translateY(0px)"};
  z-index: 5;
  &:hover {
    opacity: 1;
    transform: translateY(0px);
    transition: all 200ms ease;
  }
`;

export const ToolbarInner = styled(Wrapper)`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
`;

export const ToolbarExpandedWrapper = styled.div`
  padding-top: ${spacing._0_25};
  overflow: hidden;
  width: 100%;
`;

export const ToolbarExpandedInner = styled.div`
  border-top: solid 1px ${props => props.theme.dropdownMenuSpacerBorder};
  padding-top: ${spacing._0_25};
  overflow: auto;
  max-height: ${size.toolbarExpandedMaxHeight};
`;

export function renderToolbarIcon(
  type: SchemaMarkType | SchemaBlockType | "outline"
): React.ReactNode {
  if (type === "bold") {
    return <FontAwesomeIcon icon={faBold} />;
  } else if (type === "italic") {
    return <FontAwesomeIcon icon={faItalic} />;
  } else if (type === "underlined") {
    return <FontAwesomeIcon icon={faUnderline} />;
  } else if (type === "code") {
    return <FontAwesomeIcon icon={faCode} />;
  } else if (type === "ide") {
    return <FontAwesomeIcon icon={faCode} />;
  } else if (type === "heading-one") {
    return <FontAwesomeIcon icon={faHeading} />;
  } else if (type === "heading-two") {
    return "H2"; // TODO: find an icon for representing heading-two
  } else if (type === "block-quote") {
    return <FontAwesomeIcon icon={faQuoteLeft} />;
  } else if (type === "bulleted-list") {
    return <FontAwesomeIcon icon={faListUl} />;
  } else if (type === "numbered-list") {
    return <FontAwesomeIcon icon={faListOl} />;
  } else if (type === "outline") {
    return <FontAwesomeIcon icon={faEye} />;
  }
  return <></>;
}
