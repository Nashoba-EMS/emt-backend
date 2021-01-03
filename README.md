# emt-serverless

## Setup

- Run `yarn install`
- Create `secrets.json` file referenced below

## Deploying

- Setup a deploy script `deploy.sh` that exports the appropriate tokens: `SERVERLESS_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY`

  ```bash
  #!/bin/bash
  export SERVERLESS_ACCESS_KEY="<CHANGE ME>"
  export AWS_ACCESS_KEY_ID="<CHANGE ME>"
  export AWS_SECRET_ACCESS_KEY="<CHANGE ME>"
  ```

- Run `yarn deploy`
- Follow serverless directions for deploying

## Running Offline

Need to create a `serverless-config/secrets.json` file of the following signature. The values do not have to be real for development purposes except for ones pertaining to the database connections.

```javascript
{
  "AUTH_SECRET": "<auth_secret>",
  "AWS_ACCESS_KEY_ID": "<access_key>",
  "AWS_SECRET_ACCESS_KEY": "<secret_access_key>",
  "MONGODB_URI": "<mongo_database_uri>"
}
```

Then run:

```bash
yarn offline
```
