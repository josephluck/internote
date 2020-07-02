import NextLink from "next/link";
import React from "react";
import styled from "styled-components";

interface Props {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
}

export function TextLink({ href, scroll = false, children }: Props) {
  return (
    <NextLink href={href} scroll={scroll}>
      <TextAnchor>{children}</TextAnchor>
    </NextLink>
  );
}

export function BlockLink({ href, scroll = false, children }: Props) {
  return (
    <NextLink href={href} scroll={scroll}>
      <BlockAnchor>{children}</BlockAnchor>
    </NextLink>
  );
}

const TextAnchor = styled.a`
  color: ${(props) => props.theme.textLinkText};
  cursor: pointer;
`;

const BlockAnchor = styled.a`
  color: inherit;
  cursor: pointer;
`;