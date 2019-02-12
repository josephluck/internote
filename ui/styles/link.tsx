import * as React from "react";
import NextLink from "next/link";
import { styled } from "../theming/styled";
import { color } from "../theming/symbols";

interface Props {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
}

export function TextLink({ href, scroll = false, children }: Props) {
  return (
    <NextLink href={href} scroll={scroll} prefetch>
      <TextAnchor>{children}</TextAnchor>
    </NextLink>
  );
}

export function BlockLink({ href, scroll = false, children }: Props) {
  return (
    <NextLink href={href} scroll={scroll} prefetch>
      <BlockAnchor>{children}</BlockAnchor>
    </NextLink>
  );
}

const TextAnchor = styled.a`
  color: ${color.iron};
  cursor: pointer;
`;

const BlockAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;
