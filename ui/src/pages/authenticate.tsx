import { RouteComponentProps, navigate } from "@reach/router";
import { Box, Flex } from "@rebass/grid";
import React, { useCallback } from "react";
import styled from "styled-components";

import { signUp, verify } from "../store/auth";
import { useLoadingAction, useStately } from "../store/store";
import { Button } from "../styles/button";
import { Input, InputLabel } from "../styles/input";
import { Logo } from "../styles/logo";
import { Modal } from "../styles/modal";
import { font, spacing } from "../theming/symbols";

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

export const Authenticate: React.FunctionComponent<RouteComponentProps> = () => {
  const needsVerify = useStately((state) => state.auth.needsVerify);

  const handleAuthenticate = useLoadingAction(signUp);
  const handleVerify = useLoadingAction(verify);

  const handleSubmit = useCallback(
    async (code: string) => {
      await handleVerify.exec({ code });
      navigate("/");
    },
    [handleVerify.exec]
  );

  return (
    <>
      <Modal open showCloseIcon={false} onClose={() => null}>
        <CenteredLogo>
          <Logo large>Internote</Logo>
        </CenteredLogo>
        {needsVerify ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit((document.getElementById("verify") as any).value);
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
                loading={handleAuthenticate.loading}
              >
                Sign in
              </Button>
            </Box>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthenticate.exec({
                email: (document.getElementById("email") as any).value,
              });
            }}
          >
            <Flex mb={spacing._1} flexDirection="column">
              <InputLabel>Email</InputLabel>
              <Input type="email" id="email" />
            </Flex>
            <Box mb={spacing._1}>
              <Button
                type="submit"
                primary
                fullWidth
                loading={handleVerify.loading}
              >
                Enter
              </Button>
            </Box>
          </form>
        )}
      </Modal>
    </>
  );
};
