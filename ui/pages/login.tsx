import * as React from "react";
import { spacing } from "../styles/theme";
import { Box } from "grid-styled";
import { NextTwineSFC } from "../store/with-twine";
import { State, Actions } from "../store";
import { TextLink } from "../styles/link";

const Page: NextTwineSFC<State, Actions, {}> = props => {
  console.log(props.store.state.session);
  return (
    <>
      <Box p={spacing._2}>
        <h1>Login</h1>
        <TextLink href={`/register`}>I don't have an account</TextLink>
        <form
          onSubmit={e => {
            e.preventDefault();
            props.store.actions.authenticate({
              email: (document.getElementById("email") as any).value,
              password: (document.getElementById("password") as any).value
            });
          }}
        >
          <div>
            <label>Email</label>
            <input type="email" id="email" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" id="password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </Box>
    </>
  );
};

Page.getInitialProps = async _ctx => {
  return {};
};

export default Page;