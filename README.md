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

## Production Practice

- [Link](docs/production-checklist)
