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

> Please note that the UI application runs on http://localhost:80 and the API runs on port http://localhost:80

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

## Deployment set up

- Install `now` from [Zeit](https://zeit.co/now)
- Run `now` and authenticate
- You should be ready to deploy the app using the instructions below

## Deployment

You can simply run `yarn deploy:prod` from the root of this repository to deploy to production. Read below for the manual steps:

## API Deployment

Copy Dockerfile.api to a temporary Dockerfile in the root:

```
cp ./Dockerfile.api ./Dockerfile
```

Deploy via `now`

```
now --local-config=./now.api.json --dotenv=.env.production
```

Remove the temporary Dockerfile for the API

```
rm Dockerfile
```

## UI Deployment

Copy Dockerfile.ui to a temporary Dockerfile in the root:

```
cp ./Dockerfile.ui ./Dockerfile
```

Deploy via `now`

```
now --local-config=./now.api.json --dotenv=.env.production
```

Remove the temporary Dockerfile for the UI

```
rm Dockerfile
```


## Running build docker files locally

```
docker build -t internote/api . -f Dockerfile.api
```

```
docker run -p 1337:80 internote/api
```