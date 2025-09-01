const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Netrunner Types API',
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
          is_subtype: { type: 'boolean' },
          side_code: { oneOf: [{ enum: ['runner', 'corp'] }, { type: 'null' }] }
        },
        required: ['code', 'name', 'is_subtype', 'side_code']
      }
    }
  }
};

module.exports = () => schema;
