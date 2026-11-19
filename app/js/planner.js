// Planner view: the next unearned trophies, in roadmap order.
import { trophiesInRoadmapOrder } from './data.js';
import { displayDescription, displayName } from './filters.js';

export function nextUnearnedTrophies(trophies, earnedIds, limit = 10) {
  return trophiesInRoadmapOrder(trophies)
    .filter((trophy) => !earnedIds.has(trophy.id))
    .slice(0, limit);
}

export function renderPlanner(container, trophies, earnedIds, hideSpoilers) {
  const next = nextUnearnedTrophies(trophies, earnedIds, 10);
  container.replaceChildren();
  if (next.length === 0) {
    const done = document.createElement('li');
    done.textContent = 'All 55 earned — the platinum is yours. Leonida Legend.';
    container.append(done);
    return;
  }
  next.forEach((trophy, index) => {
    const item = document.createElement('li');
    const rank = document.createElement('span');
    rank.className = 'rank';
    rank.textContent = String(index + 1);
    const body = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = displayName(trophy, hideSpoilers, earnedIds);
    const detail = document.createElement('div');
    detail.className = 'muted';
    detail.textContent = `${displayDescription(trophy, hideSpoilers, earnedIds)} — ${trophy.grade}, Stage ${trophy.stage}`;
    body.append(name, detail);
    item.append(rank, body);
    container.append(item);
  });
}
