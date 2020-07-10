export interface Theme {
  appBackground: string;
  appText: string;
  audioTimelineActive: string;
  audioTimelineInactive: string;
  blockQuoteBorder: string;
  blockQuoteText: string;
  anchorText: string;
  codeBlockBackground: string;
  dictionaryDescriptionText: string;
  dropdownMenuBackground: string;
  dropdownMenuItemText: string;
  dropdownMenuSpacerBorder: string;
  expandingIconButtonActiveText: string;
  expandingIconButtonBackground: string;
  expandingIconButtonInactiveText: string;
  headingBackground: string;
  inputBackground: string;
  inputLabelText: string;
  inputLabelTextFocused: string;
  inputErrorText: string;
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
  settingsMenuDescriptionText: string;
}

const transparent = "transparent";

/** Accents (backgrounds) */
const pureBlack = "#000000";
const liftedBlack = "#1c1b20";
const liftedGray = "#2e2d35";

const midGray = "#555555";
const midColorGray = "#504D5D";
const mutedGrey = "#737278";
const lightGray = "#999999";
const nearlyWhite = "#D0D2D4";
const pureWhite = "#FFFFFF";

const crimsonRed = "#fe0046";
const primaryBlue = "#095efd";
const paleBlue = "#9fc7ec";
const pureGreen = "#2CCB62";

const overlay = "rgba(0,0,0,0.8)";

export const dark: Theme = {
  appBackground: pureBlack,
  appText: pureWhite,
  audioTimelineActive: paleBlue,
  audioTimelineInactive: midColorGray,
  blockQuoteBorder: midColorGray,
  blockQuoteText: lightGray,
  anchorText: primaryBlue,
  codeBlockBackground: liftedGray,
  dictionaryDescriptionText: lightGray,
  dropdownMenuBackground: liftedBlack,
  dropdownMenuItemText: nearlyWhite,
  dropdownMenuSpacerBorder: pureBlack,
  expandingIconButtonActiveText: lightGray,
  expandingIconButtonBackground: liftedBlack,
  expandingIconButtonInactiveText: midColorGray,
  headingBackground: pureBlack,
  inputBackground: liftedGray,
  inputLabelText: mutedGrey,
  inputLabelTextFocused: lightGray,
  inputErrorText: crimsonRed,
  inputText: pureWhite,
  modalBackdropBackground: overlay,
  modalBackground: liftedBlack,
  modalCloseIconColor: mutedGrey,
  noResultsText: lightGray,
  notesMenuItemTextInactive: lightGray,
  primaryButtonBackground: primaryBlue,
  primaryButtonText: pureWhite,
  savingActive: primaryBlue,
  savingInactive: pureGreen,
  searchInputBackground: liftedBlack,
  searchInputFocusedBackground: liftedGray,
  searchInputText: pureWhite,
  secondaryButtonBackground: liftedGray,
  secondaryButtonText: nearlyWhite,
  tagActiveText: nearlyWhite,
  tagBackground: liftedGray,
  tagNewBorder: mutedGrey,
  tagText: lightGray,
  textLinkText: nearlyWhite,
  toolbarBackground: liftedBlack,
  toolbarButtonActiveBackground: primaryBlue,
  toolbarButtonActiveText: pureWhite,
  toolbarButtonHoverBackground: liftedGray,
  toolbarButtonHoverText: pureWhite,
  toolbarButtonInactiveBackground: transparent,
  toolbarButtonInactiveText: midColorGray,
  settingsMenuDescriptionText: lightGray,
};

export const light: Theme = {
  appBackground: pureWhite,
  appText: pureBlack,
  audioTimelineActive: paleBlue,
  audioTimelineInactive: midColorGray,
  blockQuoteBorder: "#A79FAC",
  blockQuoteText: midGray,
  anchorText: primaryBlue,
  codeBlockBackground: "#F0F0F0",
  dictionaryDescriptionText: midGray,
  dropdownMenuBackground: "#F0F0F0",
  dropdownMenuItemText: pureBlack,
  dropdownMenuSpacerBorder: pureWhite,
  expandingIconButtonActiveText: midGray,
  expandingIconButtonBackground: pureWhite,
  expandingIconButtonInactiveText: "#A79FAC",
  headingBackground: pureWhite,
  inputBackground: "#dedbe3",
  inputLabelText: mutedGrey,
  inputLabelTextFocused: midGray,
  inputErrorText: crimsonRed,
  inputText: pureBlack,
  modalBackdropBackground: overlay,
  modalBackground: pureWhite,
  modalCloseIconColor: mutedGrey,
  noResultsText: midGray,
  notesMenuItemTextInactive: midGray,
  primaryButtonBackground: "#E0E0E0",
  primaryButtonText: pureWhite,
  savingActive: primaryBlue,
  savingInactive: pureGreen,
  searchInputBackground: "#F0F0F0",
  searchInputFocusedBackground: pureWhite,
  searchInputText: pureBlack,
  secondaryButtonBackground: "#dedbe3",
  secondaryButtonText: pureBlack,
  tagActiveText: pureBlack,
  tagBackground: pureWhite,
  tagNewBorder: "#444444",
  tagText: "#444444",
  textLinkText: pureBlack,
  toolbarBackground: "#F0F0F0",
  toolbarButtonActiveBackground: pureWhite,
  toolbarButtonActiveText: pureBlack,
  toolbarButtonHoverBackground: pureWhite,
  toolbarButtonHoverText: pureBlack,
  toolbarButtonInactiveBackground: transparent,
  toolbarButtonInactiveText: "#A79FAC",
  settingsMenuDescriptionText: "#444444",
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
    name: "Dark",
    theme: dark,
    shortcut: "i",
  },
  {
    name: "Light",
    theme: light,
    shortcut: "d",
  },
];

export interface FontTheme {
  fontFamily: string;
  googleFontName: string;
}

export const sansSerif: FontTheme = {
  googleFontName: "Work Sans",
  fontFamily: "'Work Sans', Helvetica, Arial, sans-serif",
};

export const serif: FontTheme = {
  googleFontName: "Caladea",
  fontFamily: "'Caladea', serif",
};

export const monospace: FontTheme = {
  googleFontName: "IBM Plex Mono",
  fontFamily: "'IBM Plex Mono', monospace",
};

export const googleFontsWeights = [400, 500, 700, 800];

export const fontThemes: FontThemeWithName[] = [
  {
    name: "Sans serif",
    theme: sansSerif,
    shortcut: "i",
  },
  {
    name: "Serif",
    theme: serif,
    shortcut: "e",
  },
  {
    name: "Monospace",
    theme: monospace,
    shortcut: "o",
  },
];
