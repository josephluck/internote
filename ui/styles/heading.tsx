import { spacing, color } from "../styles/theme";
import { Logo } from "../styles/logo";
import { BlockLink } from "../styles/link";
import styled from "styled-components";

const HeadingWrapper = styled.div`
  padding: ${spacing._0_5} ${spacing._2};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: ${color.cinder};
  border-bottom: solid 1px black;
`;

export function Heading({ right }: { right?: React.ReactNode }) {
  return (
    <HeadingWrapper>
      <BlockLink href="/">
        <Logo />
      </BlockLink>
      {right ? right : null}
    </HeadingWrapper>
  );
}
