// Real sample content from the report (brief: "Sample content"). Used by the gallery,
// the measurement baseline and the visual regression test. Body text only restates these facts.
const h2c = { source: 'h2c (2026)', base: '122 responses from 113 chains; vendor-sponsored, unweighted' };
const schegg = { source: 'Schegg (2025), HES-SO', base: '~1,485 hotels in AT, FR, DE, GR, IT, CH; 82% independent' };

export const SAMPLE = {
  title: 'Using AI is not the same as getting value',
  lead: '91% of hotel chains use AI, but only 28% have a senior-led, company-wide AI strategy and 13% report a measurable return.',
  figures: [
    { value: 91, unit: '%', label: 'of hotel chains use AI', ...h2c },
    { value: 28, unit: '%', label: 'have a senior-led, company-wide AI strategy', ...h2c },
    { value: 13, unit: '%', label: 'report a measurable return', ...h2c },
  ],
  chart: {
    title: 'Top barriers named by independent hotels',
    unit: '%',
    rows: [
      { label: 'Lack of knowledge', value: 39 },
      { label: 'Set-up cost', value: 35 },
      { label: 'Integration', value: 34 },
    ],
    ...schegg,
  },
  quote: 'The question is no longer whether hotels use AI, but how they make it pay.',
  body: [
    { kicker: 'Adoption', heading: 'Use is almost universal', text: '91% of hotel chains use AI.', ...h2c },
    { kicker: 'Strategy', heading: 'Strategy lags behind use', text: 'Only 28% have a senior-led, company-wide AI strategy.', ...h2c },
    { kicker: 'Return', heading: 'Few can show a return', text: '13% report a measurable return.', ...h2c },
    { kicker: 'Barriers', heading: 'Independent hotels name three barriers', text: 'Lack of knowledge (39%), set-up cost (35%) and integration (34%) are the barriers independent hotels name most often.', ...schegg },
  ],
  sources: { h2c, schegg },
  leadSource: { lead_source: h2c.source, lead_base: h2c.base },
  placeholderCredit: 'Placeholder image: replace before publication',
};
