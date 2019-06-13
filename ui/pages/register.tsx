import * as React from "react";
import { spacing, font } from "../theming/symbols";
import { Box, Flex } from "@rebass/grid";
import { NextTwineSFC } from "../store/with-twine";
import { Store } from "../store";
import { TextLink } from "../styles/link";
import { Logo } from "../styles/logo";
import { styled } from "../theming/styled";
import { Button } from "../styles/button";
import { Modal } from "../styles/modal";
import { Input, InputLabel } from "../styles/input";

const CenteredLogo = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${spacing._1};
`;

const SubActionLink = styled.div`
  text-align: center;
  font-size: ${font._12.size};
  line-height: ${font._12.lineHeight};
`;

const Page: NextTwineSFC<Store, {}> = props => {
  return (
    <>
      <Modal open showCloseIcon={false} onClose={() => null}>
        <CenteredLogo>
          <Logo large>Internote</Logo>
        </CenteredLogo>
        <form
          onSubmit={e => {
            e.preventDefault();
            props.store.actions.auth.signUp({
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
            <Button
              type="submit"
              primary
              fullWidth
              loading={props.store.state.auth.loading.signUp}
            >
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
