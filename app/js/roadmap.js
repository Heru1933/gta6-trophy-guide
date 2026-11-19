// Roadmap view: the six stages to the platinum, in the order to play them.
import { STAGE_NAMES, trophiesInRoadmapOrder } from './data.js';
import { displayName } from './filters.js';

export function renderRoadmap(container, trophies, earnedIds, hideSpoilers) {
  const ordered = trophiesInRoadmapOrder(trophies);
  container.replaceChildren();
  for (let stage = 1; stage <= 6; stage += 1) {
    const stageTrophies = ordered.filter((trophy) => trophy.stage === stage);
    const earned = stageTrophies.filter((trophy) => earnedIds.has(trophy.id)).length;
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = STAGE_NAMES[stage] + ' ';
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `${earned}/${stageTrophies.length} earned`;
    heading.append(count);
    const blurb = document.createElement('p');
    blurb.className = 'muted';
    blurb.textContent = stageBlurb(stage);
    const list = document.createElement('ul');
    for (const trophy of stageTrophies) {
      const row = document.createElement('li');
      if (earnedIds.has(trophy.id)) row.className = 'earned';
      row.textContent = `${displayName(trophy, hideSpoilers, earnedIds)} — ${trophy.grade}`;
      list.append(row);
    }
    item.append(heading, blurb, list);
    container.append(item);
  }
}

export function stageBlurb(stage) {
  switch (stage) {
    case 1: return 'Play the story in order: the opening mission, the four chapters, the named missions and the final mission. Every one of these pops on completion.';
    case 2: return 'Side strands for Andy, Kenton, Billy, Randy and Tyrone, the stranger strands and Bret’s hunt. Do them as their markers appear so the endgame stays short.';
    case 3: return 'The slow burn: meditation spots, card sets, WAiNK It locations, vehicles, the 52 areas of Leonida and the 8 garages. Sweep region by region once the map is open.';
    case 4: return 'Activities: 250 stunts, the 9 activity types, all 42 shooting-range golds, drone races, 20 race wins, fishing, arcade, challenges and bowling.';
    case 5: return 'Money and mayhem: robberies, vaults, armored trucks, gang operations, laundering $250,000 and spending $100,000 — plus the one-shot moments on the watch list.';
    case 6: return 'The finish line: 100% completion for the gold, then the platinum pops on its own. Check the in-game 100% checklist for the exact counts.';
    default: return '';
  }
}
