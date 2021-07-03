const eventQuery = require('./queries/event.query');
const { types, queries } = require('./schema/event.schema');

module.exports = {
  types,
  schemaQueries: queries,
  queries: eventQuery,
};
