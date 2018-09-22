# Internote

A simple note taking application.

## Features

- Make notes using a simple web interface
- Preview and edit notes
- Link to other notes easily
- Anonymous authentication

## Stack

- Typescript
- React
- Next
- Twine
- Koa
- Postgresql
- Typeorm

## Development environment

- Install node & yarn
- Create a cloud instance of postgres (ElephantSQL is pretty good)
- Copy `.env.reference` to `.env.development` and fill it out (ensuring you copy the right things from the postgres cloud instance)
- Install docker and docker-compose
- Run `docker-compose up --build ui-dev api-dev`
- Visit `http://localhost:80`

> Please note that the UI application runs on http://localhost:80 and the API runs on port http://localhost:2020

> If you're working on the production application locally, you'll need to create a `.env.production` file before deployment

> To run docker against production, run `docker-compose up --build ui-prod api-prod`

## Pixelbook

To get docker running on the pixelbook, unfortunately, you have to run the following after every log in (and before starting any linux applications):

```bash
ctrl + alt + t
vmc start termina
lxc profile apply penguin default
lxc profile unset default security.syscalls.blacklist
```

After this, you can open the `terminal` application and run the project using the steps above.

More reading: https://bugs.chromium.org/p/chromium/issues/detail?id=860565
And: https://www.reddit.com/r/Crostini/comments/99jdeh/70035242_rolling_out_to_dev/e4revli/

## Deployment

TBD - probably Zeit's now (since it can run Dockerfiles)
