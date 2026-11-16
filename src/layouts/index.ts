import type { Layout } from './types.js';
import { layout as lead2col } from './lead2col.js';
import { layout as cards } from './cards.js';
import { layout as zquote } from './zquote.js';
import { layout as halfbleed } from './halfbleed.js';
import { layout as strip } from './strip.js';
import { layout as quote } from './quote.js';
import { layout as inset } from './inset.js';
import { layout as divider } from './divider.js';
import { layout as contents } from './contents.js';

/** brand.json layout_library, then image_layouts, then the section divider and the generated contents. */
export const layouts: Layout[] = [lead2col, cards, zquote, halfbleed, strip, quote, inset, divider, contents];
export const layoutById = (id: string) => layouts.find((l) => l.id === id);
