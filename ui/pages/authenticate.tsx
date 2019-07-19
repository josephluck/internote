import * as React from "react";
import { spacing, font } from "../theming/symbols";
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

const Instructions = styled.p`
  font-size: ${font._16.size};
  line-height: ${font._16.lineHeight};
  text-align: center;
  margin: 0 auto;
`;

const Page: NextTwineSFC<Store, {}> = () => {
  const authenticateLoading = useTwineState(
    state => state.auth.loading.signUp2
  );
  const verifyLoading = useTwineState(state => state.auth.loading.verify);
  const needsVerify = useTwineState(state => state.auth.needsVerify);
  const authenticate = useTwineActions(actions => actions.auth.signUp2);
  const verify = useTwineActions(actions => actions.auth.verify);

  return (
    <>
      <Modal open showCloseIcon={false} onClose={() => null}>
        <CenteredLogo>
          <Logo large>Internote</Logo>
        </CenteredLogo>
        {needsVerify ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              verify({
                code: (document.getElementById("verify") as any).value
              });
            }}
          >
            <Box mb={spacing._1_5}>
              <Instructions>
                A verification code has been sent to you. Please enter it below
                to sign in:
              </Instructions>
            </Box>
            <Flex mb={spacing._1} flexDirection="column">
              <InputLabel>Verification code</InputLabel>
              <Input id="verify" />
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
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              authenticate({
                email: (document.getElementById("email") as any).value
              });
            }}
          >
            <Flex mb={spacing._1} flexDirection="column">
              <InputLabel>Email</InputLabel>
              <Input type="email" id="email" />
            </Flex>
            <Box mb={spacing._1}>
              <Button type="submit" primary fullWidth loading={verifyLoading}>
                Enter
              </Button>
            </Box>
          </form>
        )}
      </Modal>
    </>
  );
};

Page.getInitialProps = async _ctx => {
  return {};
};

export default Page;
