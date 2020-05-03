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

4. Extras
- [With Remote Schemas](https://github.com/hgiasac/hasura-typescript-boilerplate/tree/remote-schemas): From Hasura 1.2.0, remote schema can be replaced with Action. So `remote-schemas` is remove from main branches 

## Project Structure

- `services/auth`: Authentication webhook
- `services/data`: Hasura GraphQL project with migrations 
- `services/events`: Event triggers 
- `services/actions`: Hasura actions 

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
# start development dockers
make dev
# because docker caches built images, when changing packages, we need to rebuild containers
make dev-build
```

- For Test/Production environment, use `docker-compose.test.yaml` or `docker-compose.prod.yaml` config file. It requires `gcplogs` driver (read below), or you can remove it if using another logging services

```bash
make staging
# or
make prod
```

## Advanced guidelines

- [Production checklist](docs/production-checklist)
