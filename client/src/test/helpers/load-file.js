import { join } from 'path';
import { readFileSync } from 'fs';

const loadFile = (path) => JSON.parse(readFileSync(join(__dirname, '..', path), 'utf-8'));

export default loadFile;
