const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Netrunner Cycles API',
  type: 'object',
  required: ['data'],
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', pattern: '[a-z]+' },
          name: { type: 'string' },
          rotated: { type: 'boolean' }
        },
        required: ['code', 'name', 'rotated']
      }
    }
  }
};

module.exports = () => schema;
