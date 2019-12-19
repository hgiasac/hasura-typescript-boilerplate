# Hasura Typescript Boilerplate


## Project Structure

- `services/data`: Hasura GraphQL migration 
- `services/auth`: Authentication webhook
- `services/events`: Event triggers and GraphQL remote schema service

## Database design and migration

Use Hasura CLI: https://docs.hasura.io/1.0/graphql/manual/hasura-cli/install-hasura-cli.html#install

- Design: go to `services/data`, then run 

```
hasura console --admin-secret [secret] --endpoint [endpoint]
```

- Migrate: 

```
hasura migrate apply --admin-secret  [secret] --endpoint [endpoint]
```

## How to Run

- Copy `dotenv` file to `.env` and edit configuration if necessary
- Use Docker with docker-compose

```
docker-compose up
```
