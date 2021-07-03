const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { types, schemaQueries, queries } = require('../api/graphql/index');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  ${types}
  type Query {
    ${schemaQueries}
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  ...queries,
};

module.exports = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
});
