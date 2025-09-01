const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Netrunner Packs API',
  type: 'object',
  required: ['data'],
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', pattern: '[a-z]+' },
          cycle_code: { type: 'string', pattern: '[a-z]+' },
          date_release: { oneOf: [{ type: 'string' }, { type: 'null' }] },
          name: { type: 'string' }
        },
        required: ['code', 'name', 'cycle_code', 'date_release']
      }
    }
  }
};

module.exports = () => schema;
