# Hasura Typescript Boilerplate

## Boilerplate templates

1. Base Project
- [Backend](https://github.com/hgiasac/hasura-typescript-boilerplate)
- [React Admin](https://github.com/hgiasac/ra-hasura-typescript-boilerplate)
- [Next.js](https://github.com/hgiasac/hasura-next-ts-boilerplate)
- [Next.js + Tailwind](https://github.com/hgiasac/hasura-next-ts-boilerplate/tree/tailwind)

2. JWT Authentication
- [Backend](https://github.com/hgiasac/hasura-typescript-boilerplate/tree/auth-jwt)
- [React Admin](https://github.com/hgiasac/ra-hasura-typescript-boilerplate/tree/auth-jwt)
- [Next.js + Tailwind](https://github.com/hgiasac/hasura-next-ts-boilerplate/tree/tailwind)

3. Firebase Authentication
- [Backend](https://github.com/hgiasac/hasura-typescript-boilerplate/tree/auth-firebase)
- [React Admin](https://github.com/hgiasac/ra-hasura-typescript-boilerplate/tree/auth-firebase)
- [Next.js + Tailwind](https://github.com/hgiasac/hasura-next-ts-boilerplate/tree/tailwind-firebase)


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

```bash
make dev
```

- For Test/Production environment, use `docker-compose.test.yaml` or `docker-compose.prod.yaml` config file. It requires `gcplogs` driver (read below), or you can remove it if using another logging services

```bash
make staging
# or
make prod
```

## Advanced guidelines

- [Production checklist](docs/production-checklist)
