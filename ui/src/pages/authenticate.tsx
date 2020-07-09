import { RouteComponentProps, navigate } from "@reach/router";
import { Box, Flex } from "@rebass/grid";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import React from "react";
import styled from "styled-components";

import { constraints, useForm } from "../hooks/use-form";
import { signUp, verify } from "../store/auth/auth";
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
  return (
    <Modal open showCloseIcon={false} onClose={() => null}>
      <CenteredLogo>
        <Logo large>Internote</Logo>
      </CenteredLogo>
      {needsVerify ? <VerifyForm /> : <EmailForm />}
    </Modal>
  );
};

const EmailForm: React.FunctionComponent = () => {
  const handleAuthenticate = useLoadingAction(signUp);

  const { submit, registerTextInput } = useForm<{ email: string }>(
    {
      email: "",
    },
    {
      email: [constraints.isRequired],
    }
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    pipe(submit(), E.map(handleAuthenticate.exec));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex mb={spacing._1} flexDirection="column">
        <InputLabel>Email</InputLabel>
        <Input autoFocus type="email" {...registerTextInput("email")} />
      </Flex>
      <Box mb={spacing._1}>
        <Button
          type="submit"
          primary
          fullWidth
          loading={handleAuthenticate.loading}
        >
          Enter
        </Button>
      </Box>
    </form>
  );
};

const VerifyForm: React.FunctionComponent = () => {
  const handleVerify = useLoadingAction(verify);

  const { submit, registerTextInput } = useForm<{ code: string }>(
    {
      code: "",
    },
    {
      code: [constraints.isRequired],
    }
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    pipe(
      submit(),
      E.map(async (fields) => {
        await handleVerify.exec(fields);
        navigate("/");
      })
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={spacing._1_5}>
        <Instructions>
          A verification code has been sent to you. Please enter it below to
          sign in:
        </Instructions>
      </Box>
      <Flex mb={spacing._1} flexDirection="column">
        <InputLabel>Verification code</InputLabel>
        <Input autoFocus {...registerTextInput("code")} />
      </Flex>
      <Box mb={spacing._1}>
        <Button type="submit" primary fullWidth loading={handleVerify.loading}>
          Sign in
        </Button>
      </Box>
    </form>
  );
};
