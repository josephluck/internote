import styled from "styled-components";
import { font, spacing } from "../theming/symbols";

const Wrap = styled.div`
  text-align: center;
  margin: 0 auto;
  padding: ${spacing._0_5};
`;

const Emojis = styled.div`
  font-size: ${font._24.size};
  line-height: ${font._24.size};
  margin-bottom: ${spacing._0_5};
`;

const Message = styled.div`
  font-size: ${font._16.size};
  line-height: ${font._16.size};
  font-weight: 500;
  color: ${props => props.theme.noResultsText};
`;

export function NoResults({
  emojis,
  message
}: {
  emojis: React.ReactNode;
  message: React.ReactNode;
}) {
  return (
    <Wrap>
      <Emojis>{emojis}</Emojis>
      <Message>{message}</Message>
    </Wrap>
  );
}
