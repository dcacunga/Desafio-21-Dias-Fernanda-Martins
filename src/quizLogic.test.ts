import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OFFER_CONFIG,
  formatMoney,
  calculateDiscount,
  buildCheckoutUrl,
  calculateProfile,
  shouldSkipStep,
  getNextStepIndex,
  getPrevStepIndex,
  calculateActivityData,
  calculatePlanPoints,
  QUESTIONS,
} from './quizLogic';

test('formatMoney formats currency values with dots', () => {
  assert.equal(formatMoney(6990), '6.990');
  assert.equal(formatMoney(35000), '35.000');
  assert.equal(formatMoney(10900), '10.900');
  assert.equal(formatMoney(0), '0');
});

test('calculateDiscount calculates percent and savings accurately', () => {
  const d = calculateDiscount(6990, 35000);
  assert.equal(d.hasDisc, true);
  assert.equal(d.pct, 80);
  assert.equal(d.savings, 28010);
});

test('buildCheckoutUrl preserves base URL and UTM tags', () => {
  const base = OFFER_CONFIG.checkoutUrl;
  assert.equal(base, 'https://pay.clickpayon.com/522e8894-04ed-49ef-b70f-4d260e52b072');

  const withUtm = buildCheckoutUrl(base, '?utm_source=facebook&utm_campaign=blackfriday&src=bio');
  assert.ok(withUtm.includes('utm_source=facebook'));
  assert.ok(withUtm.includes('utm_campaign=blackfriday'));
  assert.ok(withUtm.includes('src=bio'));
});

test('buildCheckoutUrl handles external reference if UUID', () => {
  const uuid = '12345678-1234-1234-1234-123456789abc';
  const url = buildCheckoutUrl(OFFER_CONFIG.checkoutUrl, '', uuid);
  assert.ok(url.includes(`external_reference=${uuid}`));
});

test('skip logic correctly skips conditional breaks', () => {
  const beginnerBreakIdx = QUESTIONS.findIndex((q) => q.id === 'break-beginner');
  assert.ok(beginnerBreakIdx > 0);

  // If user says "Nunca fiz Pilates", break-beginner should NOT be skipped
  assert.equal(
    shouldSkipStep(beginnerBreakIdx, QUESTIONS, { experience: 'Nunca fiz Pilates' }),
    false
  );

  // If user says "Sim, pratico regularmente", break-beginner SHOULD be skipped
  assert.equal(
    shouldSkipStep(beginnerBreakIdx, QUESTIONS, { experience: 'Sim, pratico regularmente' }),
    true
  );
});

test('navigation helpers advance and retreat accurately', () => {
  const expIdx = QUESTIONS.findIndex((q) => q.id === 'experience');
  const beginnerBreakIdx = QUESTIONS.findIndex((q) => q.id === 'break-beginner');
  const newsIdx = QUESTIONS.findIndex((q) => q.id === 'news-tvzimbo');

  // Experienced user skipping break-beginner advances directly to news-tvzimbo
  const nextForExperienced = getNextStepIndex(expIdx, QUESTIONS, {
    experience: 'Sim, pratico regularmente',
  });
  assert.equal(nextForExperienced, newsIdx);

  // Beginner goes to break-beginner
  const nextForBeginner = getNextStepIndex(expIdx, QUESTIONS, {
    experience: 'Nunca fiz Pilates',
  });
  assert.equal(nextForBeginner, beginnerBreakIdx);

  // Back button skips processing step
  const procIdx = QUESTIONS.findIndex((q) => q.id === 'processing');
  const commitIdx = QUESTIONS.findIndex((q) => q.id === 'commitment');
  const prevFromProc = getPrevStepIndex(procIdx, QUESTIONS, {});
  assert.equal(prevFromProc, commitIdx);
});

test('calculateProfile builds user profile from answers', () => {
  const profile = calculateProfile({
    name: ' Carla ',
    minutes: '20 minutos',
    days: '3 a 5 dias',
    experience: 'Já experimentei algumas vezes',
    goal: 'Aumentar a força muscular',
    comfort: ['Joelhos'],
  });

  assert.equal(profile.name, 'Carla');
  assert.equal(profile.minutes, 20);
  assert.equal(profile.days, 4);
  assert.equal(profile.level, 2);
  assert.equal(profile.goal, 'Aumentar a força muscular');
  assert.equal(profile.caution, true);
});

test('calculateActivityData computes coordinates and ranking', () => {
  const noRoutine = calculateActivityData('Ainda não tenho uma rotina');
  assert.equal(noRoutine.rank, 0);
  assert.equal(noRoutine.label, 'Rotina a construir');
  assert.deepEqual([noRoutine.x, noRoutine.y], [32, 199]);

  const regular = calculateActivityData('Quase todos os dias');
  assert.equal(regular.rank, 3);
  assert.equal(regular.label, 'Rotina em movimento');
  assert.deepEqual([regular.x, regular.y], [307, 49]);
});

test('calculatePlanPoints returns 4 points based on daysPerWeek', () => {
  const pts = calculatePlanPoints(4);
  assert.equal(pts.length, 4);
  assert.equal(pts[0].label, '0');
  assert.equal(pts[1].label, '4');
  assert.equal(pts[2].label, '8');
  assert.equal(pts[3].label, '12');
});
