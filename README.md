# emt-serverless

```
https://ztb86wpe17.execute-api.us-east-1.amazonaws.com/dev/
```

## Setup

- Run `yarn install`
- Create `secrets.json` file referenced below

## Deploying

- Setup a deploy script `deploy.sh` that exports the appropriate tokens: `SERVERLESS_ACCESS_KEY`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY`

  ```bash
  #!/bin/bash
  export SERVERLESS_ACCESS_KEY="<CHANGE_ME>"
  export AWS_ACCESS_KEY_ID="<CHANGE_ME>"
  export AWS_SECRET_ACCESS_KEY="<CHANGE_ME>"
  ```

- Run `yarn deploy`
- Follow serverless directions for deploying

## Running Offline

Need to create a `serverless-config/secrets.json` file of the following signature. The values do not have to be real for development purposes except for ones pertaining to the database connections.

```javascript
{
  "SERVERLESS_ACCESS": "<CHANGE_ME>",
  "AUTH_SECRET": "<CHANGE_ME>",
  "ADMIN_SECRET": "<CHANGE_ME>",
  "AWS_ACCESS_KEY_ID": "<CHANGE_ME>",
  "AWS_SECRET_ACCESS_KEY": "<CHANGE_ME>",
  "MONGODB_URI": "<CHANGE_ME>"
}
```

Then run:

```bash
yarn offline
```
