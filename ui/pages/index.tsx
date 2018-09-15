import * as React from "react";
import { NextSFC } from "next";
import { Link } from "@internote/ui/styles/link";
import * as fixtures from "@internote/fixtures";
import * as Types from "@internote/api/types";

const Page: NextSFC<{ notes: Types.Note[] }> = ({ notes }) => (
  <div>
    {notes.map(note => (
      <div key={note.id}>
        <Link href={`/edit?id=${note.id}`}>{note.title}</Link>
      </div>
    ))}
  </div>
);

Page.getInitialProps = () => {
  return Promise.resolve({
    notes: [fixtures.note(), fixtures.note(), fixtures.note()]
  });
};

export default Page;
