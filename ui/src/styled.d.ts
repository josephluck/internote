// import original module declarations
import "styled-components";

import { FontTheme, Theme } from "./theming/themes";

declare module "styled-components" {
  export interface DefaultTheme extends Theme, FontTheme {}
}
