# emt-backend

![GitHub](https://img.shields.io/github/license/nashoba-ems/emt-backend) [![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![Validation](https://github.com/Nashoba-EMS/emt-backend/actions/workflows/validation.yml/badge.svg)](https://github.com/Nashoba-EMS/emt-backend/actions/workflows/validation.yml) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jtaylorchang/emt-backend.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jtaylorchang/emt-backend/context:javascript) [![Lines of Code](https://tokei.rs/b1/github/jtaylorchang/emt-backend)](https://github.com/jtaylorchang/emt-backend)

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

## License

`@nashoba-ems/emt-backend` is [BSD-3-Clause licensed](./LICENSE)
