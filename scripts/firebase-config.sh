#! /bin/bash

firebase functions:config:set hasura.url="$DATA_URL" --project $GCP_PROJECT
firebase functions:config:set hasura.admin_secret=$HASURA_GRAPHQL_ADMIN_SECRET --project $GCP_PROJECT
