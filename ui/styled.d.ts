// import original module declarations
import "styled-components";
import { Theme, FontTheme } from "./theming/themes";

declare module "styled-components" {
  export interface DefaultTheme extends Theme, FontTheme {}
}
