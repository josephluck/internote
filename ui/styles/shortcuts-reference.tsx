import React from "react";
import styled from "styled-components";
import { spacing, size, font, borderRadius } from "../theming/symbols";
import { ShortcutsContext } from "./shortcuts";
import { Tag } from "./tag";

const Wrap = styled.div`
  width: 100%;
  max-height: ${size.emojiMenuMaxHeight};
`;

const ListInner = styled.div`
  margin-bottom: -${spacing._0_25};
  max-height: ${size.emojiMenuMaxHeight};
`;

const ShortcutWrap = styled.div<{ disabled: boolean }>`
  display: inline-flex;
  width: 33%;
  margin-bottom: ${spacing._0_25};
  align-items: center;
  font-size: ${font._10.size};
`;

const ShortcutKeyCombo = styled(Tag)`
  margin-right: ${spacing._0_25};
  font-family: monospace;
  border-radius: ${borderRadius._4};
`;

const ShortcutDescription = styled.div`
  font-size: ${font._10.size};
  line-height: ${font._10.lineHeight};
`;

export function ShortcutsReference() {
  const { shortcuts } = React.useContext(ShortcutsContext);

  return (
    <Wrap>
      <ListInner>
        {shortcuts.map(shortcut => (
          <ShortcutWrap key={shortcut.id} disabled={shortcut.disabled}>
            {typeof shortcut.keyCombo === "object" ? (
              shortcut.keyCombo.map((keyCombo, i) => (
                <>
                  {i > 0 ? " / " : null}
                  <ShortcutKeyCombo key={keyCombo}>{keyCombo}</ShortcutKeyCombo>
                </>
              ))
            ) : (
              <ShortcutKeyCombo>{shortcut.keyCombo}</ShortcutKeyCombo>
            )}
            <ShortcutDescription>{shortcut.description}</ShortcutDescription>
          </ShortcutWrap>
        ))}
      </ListInner>
    </Wrap>
  );
}
