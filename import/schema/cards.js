const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Netrunner Cards API',
  type: 'object',
  required: ['data', 'imageUrlTemplate'],
  properties: {
    imageUrlTemplate: { type: 'string' },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string', pattern: '[0-9]{5}' },
          cost: { oneOf: [{ type: 'number' }, { type: 'null' }] },
          faction_code: { type: 'string', pattern: '[a-z]+' },
          illustrator: { type: 'string' },
          keywords: { type: 'string' },
          memory_cost: { type: 'number' },
          pack_code: { type: 'string', pattern: '[a-z]+' },
          side_code: { enum: ['runner', 'corp'] },
          text: { type: 'string' },
          title: { type: 'string' },
          strength: { oneOf: [{ type: 'number' }, { type: 'null' }] },
          agenda: { type: 'number' },
          advancement: { type: 'number' }
        },
        required: ['code', 'faction_code', 'pack_code', 'side_code', 'title']
      }
    }
  }
};

module.exports = () => schema;
