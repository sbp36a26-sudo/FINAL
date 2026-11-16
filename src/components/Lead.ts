export const css = `
.lead { flex: none; margin: 0; font-family: var(--font-body); font-size: var(--fs-lead); line-height: var(--lh-lead); color: var(--color-ink); max-height: calc(var(--lh-lead) * 4); overflow: hidden; }
`;
export const render = (html: string) => `<p class="lead" data-field="lead">${html}</p>`;
