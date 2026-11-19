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
