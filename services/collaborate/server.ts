import { SocketIOConnection } from "@slate-collaborative/backend";
import express from "express";

const PORT = process.env.PORT || 9000;

const defaultValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "Hello collaborator!",
      },
    ],
  },
];

const server = express()
  .use(express.static("build"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const config = {
  entry: server, // or specify port to start io server
  defaultValue,
  saveFrequency: 2000,
  onAuthRequest: async (query) => {
    // some query validation
    console.log("onAuthRequest", { query });
    return true;
  },
  onDocumentLoad: async (pathname) => {
    // request initial document ValueJSON by pathname
    console.log("onDocumentLoad", { pathname });
    return defaultValue;
  },
  onDocumentSave: async (pathname, doc) => {
    // save document
    console.log("onDocumentSave", { pathname, doc });
  },
};

new SocketIOConnection(config);
