import { Flex } from "grid-styled";
import { spacing } from "@internote/ui/styles/theme";
import { Logo } from "@internote/ui/styles/logo";
import { BlockLink } from "@internote/ui/styles/link";

export function Heading({ right }: { right?: React.ReactNode }) {
  return (
    <Flex
      pl={spacing._2}
      pr={spacing._2}
      pb={spacing._1}
      pt={spacing._1}
      alignItems="center"
      justifyContent="space-between"
    >
      <BlockLink href="/">
        <Logo />
      </BlockLink>
      {right ? right : null}
    </Flex>
  );
}
