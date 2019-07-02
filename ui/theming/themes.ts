export interface Theme {
  appBackground: string;
  appText: string;
  audioTimelineActive: string;
  audioTimelineInactive: string;
  blockQuoteBorder: string;
  blockQuoteText: string;
  codeBlockBackground: string;
  dictionaryDescriptionText: string;
  dropdownMenuBackground: string;
  dropdownMenuItemText: string;
  dropdownMenuSpacerBorder: string;
  expandingIconButtonActiveText: string;
  expandingIconButtonBackground: string;
  expandingIconButtonInactiveText: string;
  formatButtonActiveBackground: string;
  formatButtonActiveText: string;
  formatButtonInactiveBackground: string;
  formatButtonInactiveText: string;
  headingBackground: string;
  inputBackground: string;
  inputLabelText: string;
  inputText: string;
  modalBackdropBackground: string;
  modalBackground: string;
  modalCloseIconColor: string;
  noResultsText: string;
  notesMenuItemTextInactive: string;
  primaryButtonBackground: string;
  primaryButtonText: string;
  savingActive: string;
  savingInactive: string;
  searchInputBackground: string;
  searchInputFocusedBackground: string;
  searchInputText: string;
  secondaryButtonBackground: string;
  secondaryButtonText: string;
  tagActiveText: string;
  tagBackground: string;
  tagNewBorder: string;
  tagText: string;
  textLinkText: string;
  toolbarBackground: string;
  toolbarButtonActiveBackground: string;
  toolbarButtonActiveText: string;
  toolbarButtonHoverBackground: string;
  toolbarButtonHoverText: string;
  toolbarButtonInactiveBackground: string;
  toolbarButtonInactiveText: string;
}

export const internote: Theme = {
  appBackground: "#0f0d16",
  appText: "#D0D2D4",
  audioTimelineActive: "#9fc7ec",
  audioTimelineInactive: "#504D5D",
  blockQuoteBorder: "#504D5D",
  blockQuoteText: "#999999",
  codeBlockBackground: "#211F28",
  dictionaryDescriptionText: "#999999",
  dropdownMenuBackground: "#000000",
  dropdownMenuItemText: "#D0D2D4",
  dropdownMenuSpacerBorder: "#161617",
  expandingIconButtonActiveText: "#999999",
  expandingIconButtonBackground: "#19181B",
  expandingIconButtonInactiveText: "#504D5D",
  formatButtonActiveBackground: "#095efd",
  formatButtonActiveText: "#FFFFFF",
  formatButtonInactiveBackground: "#19181B",
  formatButtonInactiveText: "#504D5D",
  headingBackground: "#0f0d16",
  inputBackground: "#19181B",
  inputLabelText: "#737278",
  inputText: "#FFFFFF",
  modalBackdropBackground: "#0f0d16",
  modalBackground: "#000000",
  modalCloseIconColor: "#737278",
  noResultsText: "#999999",
  notesMenuItemTextInactive: "#999999",
  primaryButtonBackground: "#095efd",
  primaryButtonText: "#FFFFFF",
  savingActive: "#095efd",
  savingInactive: "#2CCB62",
  searchInputBackground: "#000000",
  searchInputFocusedBackground: "#19181B",
  searchInputText: "#FFFFFF",
  secondaryButtonBackground: "#19181B",
  secondaryButtonText: "#D0D2D4",
  tagActiveText: "#D0D2D4",
  tagBackground: "#19181B",
  tagNewBorder: "#737278",
  tagText: "#999999",
  textLinkText: "#D0D2D4",
  toolbarBackground: "#000000",
  toolbarButtonActiveBackground: "#095efd",
  toolbarButtonActiveText: "#FFFFFF",
  toolbarButtonHoverBackground: "#19181B",
  toolbarButtonHoverText: "#FFFFFF",
  toolbarButtonInactiveBackground: "transparent",
  toolbarButtonInactiveText: "#504D5D"
};

export const daydream: Theme = {
  appBackground: "#FFFFFF",
  appText: "#000000",
  audioTimelineActive: "#9fc7ec",
  audioTimelineInactive: "#504D5D",
  blockQuoteBorder: "#A79FAC",
  blockQuoteText: "#555555",
  codeBlockBackground: "#F0F0F0",
  dictionaryDescriptionText: "#555555",
  dropdownMenuBackground: "#F0F0F0",
  dropdownMenuItemText: "#000000",
  dropdownMenuSpacerBorder: "#FFFFFF",
  expandingIconButtonActiveText: "#555555",
  expandingIconButtonBackground: "#FFFFFF",
  expandingIconButtonInactiveText: "#A79FAC",
  formatButtonActiveBackground: "#E0E0E0",
  formatButtonActiveText: "#000000",
  formatButtonInactiveBackground: "#FFFFFF",
  formatButtonInactiveText: "#A79FAC",
  headingBackground: "#FFFFFF",
  inputBackground: "#dedbe3",
  inputLabelText: "#737278",
  inputText: "#000000",
  modalBackdropBackground: "#221a24",
  modalBackground: "#FFFFFF",
  modalCloseIconColor: "#737278",
  noResultsText: "#555555",
  notesMenuItemTextInactive: "#555555",
  primaryButtonBackground: "#E0E0E0",
  primaryButtonText: "#FFFFFF",
  savingActive: "#095efd",
  savingInactive: "#2CCB62",
  searchInputBackground: "#F0F0F0",
  searchInputFocusedBackground: "#FFFFFF",
  searchInputText: "#000000",
  secondaryButtonBackground: "#dedbe3",
  secondaryButtonText: "#000000",
  tagActiveText: "#000000",
  tagBackground: "#FFFFFF",
  tagNewBorder: "#444444",
  tagText: "#444444",
  textLinkText: "#000000",
  toolbarBackground: "#F0F0F0",
  toolbarButtonActiveBackground: "#FFFFFF",
  toolbarButtonActiveText: "#000000",
  toolbarButtonHoverBackground: "#FFFFFF",
  toolbarButtonHoverText: "#000000",
  toolbarButtonInactiveBackground: "transparent",
  toolbarButtonInactiveText: "#A79FAC"
};

export interface ColorThemeWithName {
  name: string;
  theme: Theme;
  shortcut?: string;
}

export interface FontThemeWithName {
  name: string;
  theme: FontTheme;
  shortcut?: string;
}

export const colorThemes: ColorThemeWithName[] = [
  {
    name: "Internote",
    theme: internote,
    shortcut: "i"
  },
  {
    name: "Daydream",
    theme: daydream,
    shortcut: "d"
  }
];

export interface FontTheme {
  fontFamily: string;
}

export const inter: FontTheme = {
  fontFamily: "'Inter UI', Helvetica, Arial, sans-serif"
};

export const notoSansSc: FontTheme = {
  fontFamily: "'Noto Sans SC', Helvetica, Arial, sans-serif"
};

export const spectral: FontTheme = {
  fontFamily: "'Spectral', serif"
};

export const EBGaramond: FontTheme = {
  fontFamily: "'EB Garamond', serif"
};

export const crimsonText: FontTheme = {
  fontFamily: "'Crimson Text', serif"
};

export const lora: FontTheme = {
  fontFamily: "'Lora', serif"
};

export const overpassMono: FontTheme = {
  fontFamily: "'Overpass Mono', monospace"
};

export const sourceCodePro: FontTheme = {
  fontFamily: "'Source Code Pro', monospace"
};

// TODO: trim this down to a few standard fonts (sans serif, serif and monospace)
export const fontThemes: FontThemeWithName[] = [
  {
    name: "Inter",
    theme: inter,
    shortcut: "i"
  },
  {
    name: "Noto Sans SC",
    theme: notoSansSc,
    shortcut: "n"
  },
  {
    name: "Spectral",
    theme: spectral,
    shortcut: "s"
  },
  {
    name: "EB Garamond",
    theme: EBGaramond,
    shortcut: "e"
  },
  {
    name: "Crimson Text",
    theme: crimsonText,
    shortcut: "c"
  },
  {
    name: "Lora",
    theme: lora,
    shortcut: "l"
  },
  {
    name: "Overpass Mono",
    theme: overpassMono,
    shortcut: "o"
  },
  {
    name: "Source Code Pro",
    theme: sourceCodePro,
    shortcut: "shift+s"
  }
];
