# Event Manager Project

Event manager uese RESTful APIs using Node.js, Express and Sequelize

## Requirements

 - [Node v7.6+](https://nodejs.org/en/download/current/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

#### Install dependencies:

```bash
yarn
```

#### Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
yarn dev
```

## Running with Docker Componse

```bash
docker-compose up
```

## Running in Production

```bash
yarn start
```

## Lint

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# lint and watch for changes
yarn lint:watch
```

## Test

```bash
# run all tests with Mocha
yarn test

# run unit tests
yarn test:unit

# run integration tests
yarn test:integration

# run all tests and watch for changes
yarn test:watch

# open nyc test coverage reports
yarn coverage
```

## Validate

```bash
# run lint and tests
yarn validate
```

## Logs

```bash
# show logs in production
pm2 logs
```

## Documentation

POSTMAN: https://documenter.getpostman.com/view/1662461/Tzm2JJ72 

OR

```bash
# generate and open api documentation
yarn docs
```


## Tutorials
 - [Create API Documentation Using Squarespace](https://selfaware.blog/home/2018/6/23/api-documentation)

## License

[MIT License](README.md) - [Muhammad Ndako](https://github.com/mzndako)
