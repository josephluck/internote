export interface Theme {
  appBackground: string;
  appText: string;
  headingBackground: string;
  modalBackdropBackground: string;
  dropdownMenuItemText: string;
  dropdownMenuSpacerBorder: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  inputBackground: string;
  inputText: string;
  secondaryButtonBackground: string;
  primaryButtonBackground: string;
  savingActive: string;
  savingInactive: string;
  textLinkText: string;
  codeBlockBackground: string;
  formatButtonActiveBackground: string;
  formatButtonActiveText: string;
  formatButtonInactiveText: string;
  formatButtonInactiveBackground: string;
  settingsButtonBackground: string;
  settingsButtonActiveText: string;
  settingsButtonInactiveText: string;
  toolbarButtonActiveBackground: string;
  toolbarButtonActiveText: string;
  toolbarButtonInactiveText: string;
  toolbarButtonInactiveBackground: string;
  toolbarButtonHoverBackground: string;
  blockQuoteBorder: string;
  toolbarBackground: string;
  dropdownMenuBackground: string;
  inputLabelText: string;
  modalCloseIconColor: string;
  searchInputBackground: string;
  searchInputFocusedBackground: string;
  searchInputText: string;
  notesMenuItemTextInactive: string;
  modalBackground: string;
}

export const internote: Theme = {
  appBackground: "#0f0d16",
  appText: "#D0D2D4",
  headingBackground: "#0f0d16",
  modalBackdropBackground: "#0f0d16",
  dropdownMenuItemText: "#D0D2D4",
  dropdownMenuSpacerBorder: "#161617",
  primaryButtonText: "#FFFFFF",
  secondaryButtonText: "#D0D2D4",
  inputBackground: "#19181B",
  inputText: "#FFFFFF",
  secondaryButtonBackground: "#19181B",
  primaryButtonBackground: "#095efd",
  savingActive: "#095efd",
  savingInactive: "#2CCB62",
  textLinkText: "#D0D2D4",
  codeBlockBackground: "#211F28",
  formatButtonActiveBackground: "#095efd",
  formatButtonActiveText: "#FFFFFF",
  formatButtonInactiveBackground: "#19181B",
  formatButtonInactiveText: "#504D5D",
  settingsButtonBackground: "#19181B",
  settingsButtonActiveText: "#999999",
  settingsButtonInactiveText: "#504D5D",
  toolbarButtonActiveBackground: "#095efd",
  toolbarButtonActiveText: "#FFFFFF",
  toolbarButtonInactiveBackground: "transparent",
  toolbarButtonHoverBackground: "#19181B",
  toolbarButtonInactiveText: "#504D5D",
  blockQuoteBorder: "#504D5D",
  toolbarBackground: "#000000",
  dropdownMenuBackground: "#000000",
  inputLabelText: "#737278",
  modalCloseIconColor: "#737278",
  searchInputBackground: "#000000",
  searchInputFocusedBackground: "#19181B",
  searchInputText: "#FFFFFF",
  notesMenuItemTextInactive: "#999999",
  modalBackground: "#000000"
};

export const daydream: Theme = {
  appBackground: "#F0F0F0",
  appText: "#614B67",
  headingBackground: "#F0F0F0",
  modalBackdropBackground: "#221a24",
  dropdownMenuItemText: "#614B67",
  dropdownMenuSpacerBorder: "#F0F0F0",
  primaryButtonText: "#FFFFFF",
  secondaryButtonText: "#614B67",
  inputBackground: "#dedbe3",
  inputText: "#614B67",
  secondaryButtonBackground: "#dedbe3",
  primaryButtonBackground: "#8D6B99",
  savingActive: "#8D6B99",
  savingInactive: "#2CCB62",
  textLinkText: "#614B67",
  codeBlockBackground: "#211F28",
  formatButtonActiveBackground: "#8D6B99",
  formatButtonActiveText: "#000000",
  formatButtonInactiveBackground: "#F9F9FC",
  formatButtonInactiveText: "#A79FAC",
  settingsButtonBackground: "#DFDCE4",
  settingsButtonActiveText: "#999999",
  settingsButtonInactiveText: "#A79FAC",
  toolbarButtonActiveBackground: "#8D6B99",
  toolbarButtonActiveText: "#FFFFFF",
  toolbarButtonInactiveBackground: "transparent",
  toolbarButtonHoverBackground: "#F9F9FC",
  toolbarButtonInactiveText: "#A79FAC",
  blockQuoteBorder: "#A79FAC",
  toolbarBackground: "#DFDCE4",
  dropdownMenuBackground: "#DFDCE4",
  inputLabelText: "#737278",
  modalCloseIconColor: "#737278",
  searchInputBackground: "#DFDCE4",
  searchInputFocusedBackground: "#f0f0f0",
  searchInputText: "#000000",
  notesMenuItemTextInactive: "#999999",
  modalBackground: "#F9F9FC"
};

export const colorThemes = [
  {
    name: "Internote",
    theme: internote
  },
  {
    name: "Daydream",
    theme: daydream
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

export const overpassMono: FontTheme = {
  fontFamily: "'Overpass Mono', monospace"
};

export const sourceCodePro: FontTheme = {
  fontFamily: "'Source Code Pro', monospace"
};

export const fontThemes = [
  {
    name: "Inter",
    theme: inter
  },
  {
    name: "Noto Sans SC",
    theme: notoSansSc
  },
  {
    name: "Spectral",
    theme: spectral
  },
  {
    name: "EB Garamond",
    theme: EBGaramond
  },
  {
    name: "Overpass Mono",
    theme: overpassMono
  },
  {
    name: "Source Code Pro",
    theme: sourceCodePro
  }
];
