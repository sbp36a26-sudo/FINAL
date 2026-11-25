// A small JSON Schema (draft 2020-12) validator for the keywords spec/usecase_questions_v3.schema.json uses, so the build and the
// tests can validate the question data without a new npm dependency (the repo lists ajv, but node_modules is not installed and the
// build must run on a bare checkout). Any keyword it does not know makes validation FAIL, so a schema change cannot be skipped silently.
// Supported: type (string or array), enum, const, required, properties, additionalProperties (boolean or schema), items, minItems,
// maxItems, minLength, maxLength, pattern, $ref (local "#/..." pointers only), if / then / else, and the annotations $schema, $id,
// title, description, $comment, $defs.
const ANNOTATIONS = new Set(['$schema', '$id', 'title', 'description', '$comment', '$defs']);
const KNOWN = new Set(['type', 'enum', 'const', 'required', 'properties', 'additionalProperties', 'items', 'minItems', 'maxItems',
  'minLength', 'maxLength', 'pattern', '$ref', 'if', 'then', 'else', ...ANNOTATIONS]);

const typeOf = v => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v;
const isType = (v, t) => t === 'number' ? typeof v === 'number' : t === 'integer' ? Number.isInteger(v) : typeOf(v) === t;
const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b) || (typeof a === 'object' && typeof b === 'object' && a && b && canon(a) === canon(b));
function canon(v) { return Array.isArray(v) ? '[' + v.map(canon).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}' : JSON.stringify(v); }
/* Code-point length, as JSON Schema counts string length (not UTF-16 units). */
const len = s => [...s].length;

function resolve(root, ref) {
  if (!ref.startsWith('#')) throw new Error('schema: only local $ref is supported, got ' + ref);
  return ref.slice(1).split('/').filter(Boolean).map(p => p.replace(/~1/g, '/').replace(/~0/g, '~')).reduce((o, k) => {
    if (!o || !(k in o)) throw new Error('schema: $ref does not resolve: ' + ref); return o[k];
  }, root);
}

/* Returns a list of errors ({ path, message }); an empty list means valid. */
export function validate(schema, data) {
  const errors = [];
  const run = (s, v, path) => check(schema, s, v, path, errors);
  run(schema, data, '');
  return errors;
}

function check(root, s, v, path, errors) {
  if (s === true) return; if (s === false) { errors.push({ path, message: 'false schema' }); return; }
  for (const k of Object.keys(s)) if (!KNOWN.has(k)) throw new Error('schema: unsupported keyword "' + k + '" at ' + (path || '/'));
  const err = m => errors.push({ path: path || '/', message: m });
  if (s.$ref) check(root, resolve(root, s.$ref), v, path, errors);
  if ('type' in s) { const ts = [].concat(s.type); if (!ts.some(t => isType(v, t))) err('type ' + typeOf(v) + ' is not ' + ts.join('|')); }
  if ('enum' in s && !s.enum.some(e => deepEq(e, v))) err('value ' + JSON.stringify(v) + ' is not one of ' + JSON.stringify(s.enum));
  if ('const' in s && !deepEq(s.const, v)) err('value ' + JSON.stringify(v) + ' is not ' + JSON.stringify(s.const));
  if (typeof v === 'string') {
    if ('minLength' in s && len(v) < s.minLength) err('shorter than ' + s.minLength);
    if ('maxLength' in s && len(v) > s.maxLength) err('longer than ' + s.maxLength);
    if ('pattern' in s && !new RegExp(s.pattern, 'u').test(v)) err('does not match ' + s.pattern + ': ' + JSON.stringify(v));
  }
  if (Array.isArray(v)) {
    if ('minItems' in s && v.length < s.minItems) err('fewer than ' + s.minItems + ' items');
    if ('maxItems' in s && v.length > s.maxItems) err('more than ' + s.maxItems + ' items');
    if ('items' in s) v.forEach((x, i) => check(root, s.items, x, path + '/' + i, errors));
  }
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('required' in s) s.required.forEach(k => { if (!(k in v)) err('missing required property "' + k + '"'); });
    const props = s.properties || {};
    for (const k of Object.keys(v)) {
      if (k in props) check(root, props[k], v[k], path + '/' + k, errors);
      else if ('additionalProperties' in s) check(root, s.additionalProperties, v[k], path + '/' + k, errors);
    }
  }
  if ('if' in s) {
    const sub = []; check(root, s.if, v, path, sub);
    if (!sub.length) { if ('then' in s) check(root, s.then, v, path, errors); }
    else if ('else' in s) check(root, s.else, v, path, errors);
  }
}
