import { Box } from "@rebass/grid";
import ReactHighlight from "react-highlight-words";
import { DropdownMenuItem } from "./dropdown-menu";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { spacing, font } from "../theming/symbols";

const DeleteIcon = styled.div`
  margin-left: ${spacing._1_5};
  font-size: ${font._12.size};
  cursor: pointer;
  transition: all 300ms ease;
  transform: scale(0.8, 0.8);
  opacity: 0;
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

const Highlighter = styled(ReactHighlight)<{ hasSearch: boolean }>`
  font-weight: ${props => (props.hasSearch ? 500 : 600)};
  color: ${props =>
    props.hasSearch
      ? props.theme.notesMenuItemTextInactive
      : props.theme.dropdownMenuItemText};
  mark {
    font-weight: 900;
    background: inherit;
    color: ${props => props.theme.dropdownMenuItemText};
  }
`;

export function SearchMenuItem({
  isLoading,
  isSelected,
  content,
  onDelete,
  onSelect,
  onMouseIn,
  onMouseOut,
  searchText
}: {
  isLoading?: boolean;
  isSelected?: boolean;
  content: string;
  onDelete: () => void;
  onSelect: () => void;
  onMouseIn?: () => void;
  onMouseOut?: () => void;
  searchText: string;
}) {
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
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        onClick={onSelect}
        onMouseEnter={onMouseIn}
        onMouseLeave={onMouseOut}
      >
        <Highlighter
          searchWords={searchText.split("")}
          autoEscape={true}
          textToHighlight={content}
          hasSearch={searchText.length > 0}
        />
      </Box>
      <DeleteIcon onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </DeleteIcon>
    </SearchMenuItemWrapper>
  );
}
