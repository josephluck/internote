import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";

interface Props {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
}

export function TextLink({ href, children }: Props) {
  return (
    <Link to={href}>
      <TextAnchor>{children}</TextAnchor>
    </Link>
  );
}

export function BlockLink({ href, children }: Props) {
  return (
    <Link to={href}>
      <BlockAnchor>{children}</BlockAnchor>
    </Link>
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
