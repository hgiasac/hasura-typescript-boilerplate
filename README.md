# Hasura Typescript Boilerplate


## Project Structure

- `services/data`: Hasura GraphQL migration 
- `services/auth`: Authentication webhook
- `services/events`: Event triggers and GraphQL remote schema service

## Database design and migration

Use Hasura CLI: https://docs.hasura.io/1.0/graphql/manual/hasura-cli/install-hasura-cli.html#install

- Design: go to `services/data`, then run 

```bash
hasura console --admin-secret [secret] --endpoint [endpoint]
```

- Migrate: 

```bash
hasura migrate apply --admin-secret  [secret] --endpoint [endpoint]
```

## How to Run

- Copy `dotenv` file to `.env` and edit configuration if necessary
- Use Docker with docker-compose

```
docker-compose up -d
```
- For Test/Production environment, use `docker-compose.dev.yaml` or `docker-compose.prod.yaml` config file. It requires `gcplogs` driver (read below), or you can remove it if using another logging services

```bash
docker-compose -f ./docker-compose.dev.yaml up -d
```

## Production Guideline

- On server environment, it's best practice to store logs to external monitor services. In this boilerplate, we will use [Google Cloud Logging Driver](https://docs.docker.com/config/containers/logging/gcplogs/). This driver require setting default `Google Application Default Credential` that need to override docker daemon [link](https://stackoverflow.com/questions/49983216/the-google-cloud-logging-driver-for-docker)
- If we use [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine), Google Logging Driver is built-in. [Google Compute Engine](https://cloud.google.com/compute) instances have `Google Application Default Credential` already, no need to customize Docker daemon
