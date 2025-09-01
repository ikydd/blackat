const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Netrunner Factions API',
  type: 'object',
  required: ['data'],
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', pattern: '[a-z-]+' },
          color: { type: 'string' },
          name: { type: 'string' },
          side_code: { enum: ['runner', 'corp'] }
        },
        required: ['code', 'name', 'color', 'side_code']
      }
    }
  }
};

module.exports = () => schema;
