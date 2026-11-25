// The v3 question data (spec/usecase_questions_v3*.json), checked before it is inlined. Used by build.mjs and the tests.
// spec/ is the owner's source of truth: it is read, never written.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate } from './schema.mjs';

export const here = join(dirname(fileURLToPath(import.meta.url)), '..');
const spec = f => JSON.parse(readFileSync(join(here, 'spec', f), 'utf8'));

/* The change-log fields the runtime file leaves out (reports only, never shown: review_verdict, treatment, the fate of the 661 originals).
   counts.original_questions (the number 661) stays: only the original_questions lists are change log. */
export const CHANGELOG_KEYS = ['note', 'old_title', 'original_questions', 'reason', 'replaces', 'review_verdict', 'treatment'];

export function strip(v) {
  if (Array.isArray(v)) return v.map(strip);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).filter(([k, x]) => !CHANGELOG_KEYS.includes(k) || (k === 'original_questions' && !Array.isArray(x))).map(([k, x]) => [k, strip(x)]));
  return v;
}

/* The schema requires original_questions on every use case, which is a change-log field the runtime file drops by design (it is
   the same data "with the change-log fields removed"). The runtime file is therefore validated against the same schema with only
   that one requirement lifted; everything else is identical. The full file is validated against the schema exactly as given. */
export function runtimeSchema(schema) {
  const s = JSON.parse(JSON.stringify(schema));
  const it = s.properties.use_cases.items;
  it.required = it.required.filter(k => k !== 'original_questions');
  return s;
}

const fmt = (name, errs) => name + ' fails its schema (' + errs.length + ' errors): ' + errs.slice(0, 8).map(e => e.path + ' ' + e.message).join('; ');

/* Loads and checks both files. Throws (and so fails the build) on any schema error or when the runtime file is not exactly the
   full file without its change-log fields. Returns { full, runtime, schema }. */
export function loadV3() {
  const schema = spec('usecase_questions_v3.schema.json'), full = spec('usecase_questions_v3.json'), runtime = spec('usecase_questions_v3.runtime.json');
  let e = validate(schema, full); if (e.length) throw new Error(fmt('spec/usecase_questions_v3.json', e));
  e = validate(runtimeSchema(schema), runtime); if (e.length) throw new Error(fmt('spec/usecase_questions_v3.runtime.json', e));
  if (JSON.stringify(strip(full)) !== JSON.stringify(runtime)) throw new Error('spec/usecase_questions_v3.runtime.json is not usecase_questions_v3.json without its change-log fields');
  return { full, runtime, schema };
}

export function goldenCases() { return spec('golden_cases_v3.json'); }
