// Loads the trophy data file and exposes the list plus its stage names.
export const STAGE_NAMES = {
  1: 'Stage 1 — Play the story',
  2: 'Stage 2 — Strangers & side strands',
  3: 'Stage 3 — Collectibles & exploration',
  4: 'Stage 4 — Activities & skills',
  5: 'Stage 5 — Money & mayhem',
  6: 'Stage 6 — Cleanup & 100%',
};

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
};

// Round 3: what each stage is for, in one line, so the planner and the
// roadmap can say why a trophy belongs where it does without repeating
// the whole stage blurb.
export const STAGE_FOCUS = {
  1: 'Story first — nothing here can be missed except the Chapter 1 meditation.',
  2: 'Side strands — quest givers return in free roam, so none of these lock out.',
  3: 'Collectibles — sweep region by region once the map is open.',
  4: 'Activities — most land on their own while you do everything else.',
  5: 'Money and mayhem — robberies, vaults and the one-shot moments.',
  6: 'Cleanup — 100% completion, then the platinum pops on its own.',
};

export function stageFocus(stage) {
  return STAGE_FOCUS[stage] || '';
}

export function trophiesByStage(trophies) {
  const byStage = {};
  for (const trophy of trophiesInRoadmapOrder(trophies)) {
    (byStage[trophy.stage] || (byStage[trophy.stage] = [])).push(trophy);
  }
  return byStage;
}

let cachedTrophies = null;

export async function loadTrophies() {
  if (cachedTrophies) return cachedTrophies;
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const document = await response.json();
  cachedTrophies = document.trophies.slice().sort((a, b) => a.id - b.id);
  return cachedTrophies;
}

export function trophyById(trophies, id) {
  return trophies.find((trophy) => trophy.id === id);
}

export function trophiesInRoadmapOrder(trophies) {
  return trophies.slice().sort((a, b) => (a.stage - b.stage) || (a.order - b.order) || (a.id - b.id));
}

export function countByKind(trophies, earnedIds) {
  const counts = {};
  for (const trophy of trophies) {
    const key = trophy.kind;
    counts[key] = counts[key] || { total: 0, earned: 0 };
    counts[key].total += 1;
    if (earnedIds.has(trophy.id)) counts[key].earned += 1;
  }
  return counts;
}
