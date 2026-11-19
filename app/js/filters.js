// Search, kind, grade and spoiler filtering for the checklist.
export function trophyMatchesSearch(trophy, query) {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  const haystack = [trophy.name, trophy.description, trophy.guide].join(' ').toLowerCase();
  return haystack.includes(needle);
}

export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true || trophy.watch === true;
  return trophy.kind === kind;
}

export function trophyMatchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

export function applyChecklistFilters(trophies, { query, kind, grade, unearnedOnly, earnedIds }) {
  return trophies.filter((trophy) => {
    if (unearnedOnly && earnedIds.has(trophy.id)) return false;
    return trophyMatchesSearch(trophy, query)
      && trophyMatchesKind(trophy, kind)
      && trophyMatchesGrade(trophy, grade);
  });
}

export function isSpoilerHidden(trophy, hideSpoilers, earnedIds) {
  return hideSpoilers && trophy.hidden === true && !earnedIds.has(trophy.id);
}

export function displayName(trophy, hideSpoilers, earnedIds) {
  return isSpoilerHidden(trophy, hideSpoilers, earnedIds) ? 'Hidden trophy' : trophy.name;
}

export function displayDescription(trophy, hideSpoilers, earnedIds) {
  return isSpoilerHidden(trophy, hideSpoilers, earnedIds)
    ? 'Hidden on PlayStation until earned — tick it earned to reveal it.'
    : trophy.description;
}
