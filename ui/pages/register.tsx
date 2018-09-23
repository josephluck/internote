import * as React from "react";
import { spacing, font } from "../styles/theme";
import { Box, Flex } from "grid-styled";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { TextLink } from "../styles/link";
import { Logo } from "../styles/logo";
import styled from "styled-components";
import { Button } from "../styles/button";
import { Modal } from "../styles/modal";
import { Input, InputLabel } from "../styles/input";

const BareBar = styled.div`
  padding: ${spacing._0_5} ${spacing._2};
`;

const SubActionLink = styled.div`
  text-align: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
`;

const Page: NextTwineSFC<State, Actions, {}> = props => {
  return (
    <>
      <BareBar>
        <Logo />
      </BareBar>
      <Modal open showCloseIcon={false} onClose={() => null}>
        <form
          onSubmit={e => {
            e.preventDefault();
            props.store.actions.register({
              email: (document.getElementById("email") as any).value,
              password: (document.getElementById("password") as any).value
            });
          }}
        >
          <Flex mb={spacing._1} flexDirection="column">
            <InputLabel>Email</InputLabel>
            <Input type="email" id="email" />
          </Flex>
          <Flex mb={spacing._1} flexDirection="column">
            <InputLabel>Password</InputLabel>
            <Input type="password" id="password" />
          </Flex>
          <Box mb={spacing._1}>
            <Button type="submit" primary fullWidth>
              Register
            </Button>
          </Box>
          <SubActionLink>
            <TextLink href={`/login`}>I already have an account</TextLink>
          </SubActionLink>
        </form>
      </Modal>
    </>
  );
};

Page.getInitialProps = async _ctx => {
  return {};
};

export default Page;
