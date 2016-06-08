# Setting up Concourse CI

## Building Base Box

Before you can build a test box in ConcourseCI. This should be a one time exercise. First check out [this](https://github.com/pivotal-sg/image-builder) repo.

```bash
git clone git@github.com:pivotal-sg/image-builder.git
git checkout spotlight-base
docker build -t pivotalsingapore/build-image .
```

Push to `pivotalsingapore` on Docker Hub

```bash
docker push pivotalsingapore/build-image
```

## Building Test Box

```bash
docker build -t pivotalsingapore/spotlight-dashboard-tests -f Dockerfile.tests .
```

Push that `pivotalsingapore` Docker Hub

```bash
docker push pivotalsingapore/concourse-dashboard-tests
```

## Setting up Concourse CI with Fly CLI

Add the Concourse Pipeline using these commands. Remember to create a `credentials.yml` file.

```
---
docker-email: <dockerhub_email>
docker-username: <dockerhub_username>
docker-password: <dockerhub_password>
git-private-key: |
  -----BEGIN RSA PRIVATE KEY-----
	<private key of user who has access to GitHub project>
  -----END RSA PRIVATE KEY-----
```

Commands to run:

```bash
fly -t aws login -c http://ci
fly -t aws set-pipeline -p spotlight-dashboard-tests -c spotlight-dashboard.yml -l credentials.yml
```