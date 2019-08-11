import Link from "next/link";
import { Box } from "@rebass/grid";
import ReactHighlight from "react-highlight-words";
import { DropdownMenuItem } from "./dropdown-menu";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { spacing, font } from "../theming/symbols";
import { GetNoteDTO } from "@internote/notes-service/types";

const DeleteIcon = styled.div`
  margin-left: ${spacing._1_5};
  font-size: ${font._12.size};
  cursor: pointer;
  transition: all 300ms ease;
  transform: scale(0.8, 0.8);
  opacity: 0;
`;

const NoteMenuItemWrapper = styled(DropdownMenuItem)`
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

export function NoteMenuItem({
  isLoading,
  isSelected,
  note,
  onDelete,
  onSelect,
  searchText
}: {
  isLoading: boolean;
  isSelected: boolean;
  note: GetNoteDTO;
  onDelete: () => void;
  onSelect: () => void;
  searchText: string;
}) {
  return (
    <NoteMenuItemWrapper
      key={note.noteId}
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
      >
        <Link href={`?id=${note.noteId}`} passHref>
          <a>
            <Highlighter
              searchWords={searchText.split("")}
              autoEscape={true}
              textToHighlight={note.title}
              hasSearch={searchText.length > 0}
            />
          </a>
        </Link>
      </Box>
      <DeleteIcon onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </DeleteIcon>
    </NoteMenuItemWrapper>
  );
}
