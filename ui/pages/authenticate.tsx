import * as React from "react";
import { spacing } from "../theming/symbols";
import { Box, Flex } from "@rebass/grid";
import { NextTwineSFC } from "../store/with-twine";
import { Store, useTwineState, useTwineActions } from "../store";
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

const Page: NextTwineSFC<Store, {}> = () => {
  const authenticateLoading = useTwineState(
    state => state.auth.loading.authenticate
  );
  const signUp = useTwineActions(actions => actions.auth.signUp2);
  const signIn = useTwineActions(actions => actions.auth.signIn2);
  const verify = useTwineActions(actions => actions.auth.verify);

  return (
    <>
      <Modal open showCloseIcon={false} onClose={() => null}>
        <CenteredLogo>
          <Logo large>Internote</Logo>
        </CenteredLogo>
        <br />
        <form
          onSubmit={e => {
            e.preventDefault();
            signUp({
              email: (document.getElementById("sign-up-email") as any).value
            });
          }}
        >
          <Flex mb={spacing._1} flexDirection="column">
            <InputLabel>Email</InputLabel>
            <Input type="email" id="sign-up-email" />
          </Flex>
          <Box mb={spacing._1}>
            <Button
              type="submit"
              primary
              fullWidth
              loading={authenticateLoading}
            >
              Sign up
            </Button>
          </Box>
        </form>
        <br />
        <form
          onSubmit={e => {
            e.preventDefault();
            signIn({
              email: (document.getElementById("sign-in-email") as any).value
            });
          }}
        >
          <Flex mb={spacing._1} flexDirection="column">
            <InputLabel>Email</InputLabel>
            <Input type="email" id="sign-in-email" />
          </Flex>
          <Box mb={spacing._1}>
            <Button
              type="submit"
              primary
              fullWidth
              loading={authenticateLoading}
            >
              Sign in
            </Button>
          </Box>
        </form>
        <br />
        <form
          onSubmit={e => {
            e.preventDefault();
            verify({
              code: (document.getElementById("verify") as any).value
            });
          }}
        >
          <Flex mb={spacing._1} flexDirection="column">
            <InputLabel>Code</InputLabel>
            <Input id="verify" />
          </Flex>
          <Box mb={spacing._1}>
            <Button
              type="submit"
              primary
              fullWidth
              loading={authenticateLoading}
            >
              Verify
            </Button>
          </Box>
        </form>
      </Modal>
    </>
  );
};

Page.getInitialProps = async _ctx => {
  return {};
};

export default Page;
