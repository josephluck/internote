import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";

interface Props {
  href: string;
  children: React.ReactNode;
  scroll?: boolean;
}

export function TextLink({ href, children }: Props) {
  return <TextAnchor to={href}>{children}</TextAnchor>;
}

export function BlockLink({ href, children }: Props) {
  return <BlockAnchor to={href}>{children}</BlockAnchor>;
}

const TextAnchor = styled(Link)`
  color: ${(props) => props.theme.textLinkText};
  cursor: pointer;
`;

const BlockAnchor = styled(Link)`
  color: inherit;
  cursor: pointer;
`;
