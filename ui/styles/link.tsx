import NextLink from "next/link";
import styled from "styled-components";
import { colors } from "@internote/ui/styles/theme";

interface Props {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
}

export function Link({ href, scroll = false, children }: Props) {
  return (
    <NextLink href={href} scroll={scroll} prefetch>
      <TextAnchor>{children}</TextAnchor>
    </NextLink>
  );
}

const TextAnchor = styled.a`
  color: ${colors.iron};
  border-bottom: solid 2px ${colors.iron};
  cursor: pointer;
`;
