import { faCheck, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@rebass/grid";
import React, { useCallback } from "react";
import ReactHighlight from "react-highlight-words";
import styled from "styled-components";

import { font, spacing } from "../theming/symbols";
import { DropdownMenuItem } from "./dropdown-menu";

const DeleteIcon = styled.div.withConfig({
  shouldForwardProp: (prop: React.ReactText, def) =>
    !(["forceShow"] as React.ReactText[]).includes(prop) && def(prop),
})<{ forceShow: boolean }>`
  margin-left: ${spacing._1_5};
  font-size: ${font._12.size};
  cursor: pointer;
  transition: all 300ms ease;
  transform: scale(0.8, 0.8);
  opacity: ${(props) => (props.forceShow ? `1 !important` : 0)};
`;

const SearchMenuItemWrapper = styled(DropdownMenuItem)`
  &:hover {
    ${DeleteIcon} {
      transform: scale(1, 1);
      opacity: 0.2;
      &:hover {
        opacity: 1;
      }
    }
  }
`;

const Highlighter = styled(ReactHighlight)<{ searchWords: string[] }>`
  font-weight: ${(props) => (props.searchWords.length > 0 ? 500 : 600)};
  color: ${(props) =>
    props.searchWords.length > 0
      ? props.theme.notesMenuItemTextInactive
      : props.theme.dropdownMenuItemText};
  mark {
    font-weight: 900;
    background: inherit;
    color: ${(props) => props.theme.dropdownMenuItemText};
  }
`;

export const SearchMenuItem: React.FunctionComponent<{
  isLoading?: boolean;
  isSelected?: boolean;
  content: string;
  onDelete: () => void;
  onSelect: () => void;
  onMouseIn?: () => void;
  onMouseOut?: () => void;
  searchText: string;
  deleteLoading?: boolean;
}> = ({
  isLoading,
  isSelected,
  content,
  onDelete,
  onSelect,
  onMouseIn,
  onMouseOut,
  searchText,
  deleteLoading = false,
}) => {
  const handleOnSelect = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      onSelect();
    },
    [onSelect]
  );

  const handleOnDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      onDelete();
    },
    [onDelete]
  );

  return (
    <SearchMenuItemWrapper
      icon={
        isLoading ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : !isLoading && isSelected ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : null
      }
    >
      <Box
        flex="1"
        style={boxStyle}
        onMouseDown={handleOnSelect as any}
        onMouseEnter={onMouseIn}
        onMouseLeave={onMouseOut}
      >
        <Highlighter
          searchWords={searchText ? searchText.split("") : []}
          autoEscape={true}
          textToHighlight={content || ""}
        />
      </Box>
      <DeleteIcon onMouseDown={handleOnDelete} forceShow={deleteLoading}>
        <FontAwesomeIcon
          icon={deleteLoading ? faSpinner : faTrash}
          spin={deleteLoading}
        />
      </DeleteIcon>
    </SearchMenuItemWrapper>
  );
};

const boxStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
};
