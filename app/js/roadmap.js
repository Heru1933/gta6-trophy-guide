// Roadmap view: the six stages to the platinum, in the order to play them.
// Round 3: every stage blurb now names its missions, collectibles and counts
// (from PowerPyx's walkthrough), and every row carries a short note saying
// where its trophy fits — chapter, quest count, or what it unlocks.
import { STAGE_NAMES, trophiesInRoadmapOrder } from './data.js';
import { displayName } from './filters.js';

// Where each trophy sits in the run: chapter and mission, quest count, or the
// count it needs. Written from PowerPyx's trophy guide; ids not listed here
// fall back to their stage's blurb.
const ROADMAP_NOTES = {
  2: 'Ch 1 · first mission: Gone Fishing',
  3: 'Ch 1 · pops as Ch 2 opens: What\u2019s in the Bag?',
  4: 'Ch 2 · pops as Ch 3 opens: Welcome to Vice City',
  5: 'Ch 3 · pops after Ch 4 opens: Ocean Beach + Another Life',
  6: 'Ch 4 · final mission: Starting From Zero',
  7: 'Final mission: Starting From Zero (Ch 4)',
  8: 'Ch 2 · Breakfast Run',
  9: 'Ch 3 · The Cartel Heist',
  10: 'Ch 4 · Child\u2019s Play',
  11: 'Ch 4 · Headliners',
  12: 'Ch 4 · VCIA Takedown',
  13: 'Ch 5 · Operation Savage Glory',
  22: 'Lucia-only · 5 quests in Belville (Ch 3)',
  23: '7 shipwrecks · Kenton, Key Lento (Ch 1)',
  24: '5 quests · Thrillbilly Mudclub (after Coffee Break)',
  25: '8 strands · Kirk, Kyle, Yago, Pilot Pete',
  26: '16-car wishlist · Randy, west Vice City',
  27: 'Jason-only · Synthetic Labs, 2 quests',
  29: 'Jason-only · Bret, 15 Target Decks',
  28: '18 meditations · 10 spots · Ch 1 balcony first!',
  30: '18 card sets · any 3',
  31: '100 scans · 31 landmarks + 35 curiosities + 23 sculptures',
  35: '100 of 557 vehicles · WAiNK scan',
  42: 'Unfog the whole map by plane',
  54: '8 garages · $160,000 total',
  15: '250 of 397 stunts · 130 jumps, 202 under bridges',
  16: '9 activity types · check Progress > Activities',
  17: '42 golds · 12 shooting ranges',
  18: '14 locations · 42 drone races',
  19: '20 wins · 40 unique races',
  20: 'Cal\u2019s fishing questline (after Feng Shui)',
  21: '4 video games · finish one to the end',
  32: '50 of 80 challenges · 70 needed for 100%',
  46: '3 valuables · Kingpin Bowling, Port Gellhorn',
  51: '10 kicks in 60 s · bike, crowded street',
  33: 'After Coffee Break · 4 stars with your partner',
  34: '3 shops in a row · keep the wanted level',
  37: 'Plane at VCIA terminals E3/E4 · fly 1 km clear',
  38: 'Tank at Mile Zero Air Station, Mariana County',
  39: 'Snap Gun back-door job · Richardson Jewelry',
  40: '5 of 8 vaults · up to $205,000 each',
  41: 'Bank vault counts · or sticky-bomb a truck',
  43: '1 per gang · 39 operations total',
  44: 'Ocean View Rooftop Bar · Apple Martini',
  45: 'Blue Banshee · showroom, south Vice City',
  47: 'Max strength, both characters at once',
  48: '500 criminal-profile actions',
  49: 'Still unknown — do not grind it yet',
  50: 'UFO · Starlet Motel road, after 2 AM',
  52: '$250,000 laundered · Yasmani pays most',
  53: '$100,000 spent · guns, mods, tattoos',
  55: '10 registrations · Moses, Port Gellhorn',
  14: '100% checklist · ~60% true completion',
  1: 'Pops when the other 54 are done',
};

export function roadmapNote(trophy) {
  return ROADMAP_NOTES[trophy.id] || `Stage ${trophy.stage} · ${trophy.grade}`;
}

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
      const note = document.createElement('span');
      note.className = 'roadmap-note';
      note.textContent = roadmapNote(trophy);
      row.append(document.createElement('br'), note);
      list.append(row);
    }
    item.append(heading, blurb, list);
    container.append(item);
  }
}

export function stageBlurb(stage) {
  switch (stage) {
    case 1: return 'Play the story in order across five chapters: Gone Fishing and Down to Earth (Ch 1), What\u2019s in the Bag? and Breakfast Run (Ch 2), Welcome to Vice City and The Cartel Heist (Ch 3), Ocean Beach, Another Life, Child\u2019s Play, Headliners and VCIA Takedown (Ch 4), then Starting From Zero (final mission) and Operation Savage Glory (Ch 5). Every one of these pops on completion; chapter trophies land as the next chapter opens.';
    case 2: return 'Side strands, in the order they open: Kenton\u2019s 7 shipwrecks (Ch 1, Key Lento), Billy\u2019s 5 quests at the Thrillbilly Mudclub and Bret\u2019s hunt (after Coffee Break, Ch 2), then Andy\u2019s 5 Lucia-only quests in Belville, Randy\u2019s 16-car wishlist and Tyrone\u2019s 2 lab quests (Ch 3) — plus 8 Strangers & Freaks strands (Kirk, Kyle, Yago, Pilot Pete). Do them as their markers appear so the endgame stays short.';
    case 3: return 'The slow burn: 18 meditations at 10 spots (do the Chapter 1 balcony one first — it can go away), 3 of 18 card sets, 100 WAiNK It scans, 100 of 557 vehicles discovered, the 52 areas of Leonida, and 8 garages for $160,000. Sweep region by region once the map is open, scanning everything with the WAiNK app as you go.';
    case 4: return 'Activities: 250 of 397 stunts (130 jumps, 202 under bridges, 40 knife flights, 25 base jumps), the 9 activity types, all 42 shooting-range golds at 12 ranges, 14 drone-race locations (42 races), 20 wins from 40 unique races, Cal\u2019s fishing challenge, one of 4 arcade games, 50 of 80 challenges, and the Kingpin Bowling robbery.';
    case 5: return 'Money and mayhem: 5 of 8 bank vaults (up to $205,000 each), 39 gang operations across 9 gangs, armored trucks, $250,000 laundered through fences and $100,000 spent — plus the one-shot moments on the watch list (VCIA plane, Rhino tank, blue Banshee, UFO after 2 AM). Most of this opens after Coffee Break (Ch 2) and the bank-vault mission in Ch 4.';
    case 6: return 'The finish line: 100% completion for the gold, then the platinum pops on its own. The checklist wants any 100 optional missions, 200 of 277 vehicles scanned, 100 of 255 animals studied, 15 of 18 meditations, 300 stunts, any 70 of 80 challenges, and all robberies, vaults, drone races, shooting ranges and Target Decks. Check the in-game 100% checklist for the exact counts.';
    default: return '';
  }
}
