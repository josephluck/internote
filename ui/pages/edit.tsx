import * as React from "react";
import { NextSFC } from "next";
import * as fixtures from "@internote/fixtures";
import * as Types from "@internote/api/types";

const Page: NextSFC<{ note: Types.Note }> = ({ note }) => (
  <div>edit note {note.id}</div>
);

Page.getInitialProps = ctx => {
  return Promise.resolve({
    note: {
      ...fixtures.note(),
      id: ctx.query.id.toString()
    }
  });
};

export default Page;
