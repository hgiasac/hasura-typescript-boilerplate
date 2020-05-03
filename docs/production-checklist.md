# Production checklist

## Hasura Production checklist

https://hasura.io/docs/1.0/graphql/manual/deployment/production-checklist.html

## Logging

- On server environment, it's best practice to store logs to external monitor services. In this boilerplate, we will use [Google Cloud Logging Driver](https://docs.docker.com/config/containers/logging/gcplogs/). This driver require setting default `Google Application Default Credential` that need to override docker daemon [link](https://stackoverflow.com/questions/49983216/the-google-cloud-logging-driver-for-docker)

- However, `gcplogs` only posts raw message. We need to parse message to JSON. There is another solution [link](https://stackoverflow.com/questions/53187841/docker-gcplogs-message-as-json) that use `google-fluentd`

- If we use [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine), Google Logging Driver is built-in. [Google Compute Engine](https://cloud.google.com/compute) instances have `Google Application Default Credential` already, no need to customize Docker daemon
