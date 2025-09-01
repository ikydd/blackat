const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Netrunner MWL API',
  type: 'object',
  required: ['data'],
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          active: { type: 'boolean' },
          cards: {
            type: 'object',
            patternProperties: {
              '[0-9]{5}': { type: 'object' }
            }
          }
        }
      }
    }
  }
};

module.exports = () => schema;
