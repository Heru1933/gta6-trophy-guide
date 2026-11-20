// Planner view: the next unearned trophies, in roadmap order.
// Round 3: every item now says why it is next and what it unlocks, so the
// planner reads as a plan instead of a bare list. The reasons are written
// from PowerPyx's trophy guide; ids without a specific note fall back to
// their stage's purpose.
import { trophiesInRoadmapOrder } from './data.js';
import { displayDescription, displayName } from './filters.js';

// Why this trophy is next, and what doing it unlocks. Keys are trophy ids.
const PLANNER_WHY = {
  28: 'Do it now — the Chapter 1 balcony meditation is the only step in the game that can go away. It unlocks nothing else, but missing it may cost the trophy.',
  30: 'Next collectible on the sweep: any 3 of 18 card sets. Pairs with the WAiNK and vehicle scans on the same route.',
  31: 'Scan as you explore — 100 WAiNK scans also feed vehicle discovery and Randy\u2019s wishlist checks.',
  35: 'Scan every new vehicle with WAiNK: 100 here, 200 of 277 for the 100% checklist.',
  42: 'Unfog the map by plane once the state is open — the sweep also finds cards, scans and garages.',
  54: 'Buy garages as you find them ($160,000 total) — parking spots are what let you register vehicles for On the Spot.',
  15: 'Grind Under the Bridges first — quickest of the 397 stunts, and 300 are needed for 100%.',
  17: '42 golds at 12 ranges; also raises Focus, which Gunslinger needs.',
  18: '14 drone locations, 42 races — all of them count toward 100%.',
  19: '20 wins from 40 races; a repeat win on one course does not count.',
  20: 'Follow Cal\u2019s fishing questline — fishing also counts as an activity type and raises Focus.',
  21: 'Quickest bronze left: finish any one of the 4 video games to the end.',
  32: '50 of 80 challenges; leave the hardest ten — 70 of 80 are needed for 100%.',
  46: 'Kingpin Bowling robbery: 3 valuables, then escape the police.',
  51: '10 kicks in 60 seconds on a bike — a fast one in a crowded street.',
  33: 'Needs your partner beside you (after Coffee Break) — also pops automatically during the bank-vault mission.',
  34: 'Three shops in a row without losing the wanted level — the north Vice City jewelry stores are the spot.',
  37: 'Steal the docked plane at VCIA terminals E3/E4 and fly 1 km clear.',
  38: 'Steal a Rhino tank at Mile Zero Air Station and shoot enemies.',
  39: 'Needs the Snap Gun from Yasmani\u2019s Jewelry Jobs (Ch 3) — back-door entry, safe code, no alarm.',
  40: 'Opens with the Ch 4 vault mission — 5 of 8 vaults, up to $205,000 each, and the fastest money in the game.',
  41: 'A bank-vault robbery counts here too — or sticky-bomb a truck in free roam.',
  43: 'One operation per gang (9 gangs, 39 total) — all 39 are needed for 100%.',
  44: 'One drink at the Ocean View Rooftop Bar: an Apple Martini, standing by the bar.',
  45: 'Needs the Key Cloner (Ch 3) — the blue Banshee, south Vice City showroom, straight through the window.',
  47: 'Max strength on both characters at once — train together so both progress.',
  48: '500 criminal-profile actions — it builds passively; check the count on the trophy itself.',
  49: 'Still unknown — skip it for now and check back; do not grind for it.',
  50: 'UFO easter egg: Starlet Motel road, Kelly County, alone after 2 AM — the blinking car is the trigger.',
  52: 'Needs the Dye Pack Jammer (Ch 3, Credit Check) — launder at fences; Yasmani pays most.',
  53: 'Spend $100,000 — guns, car mods and tattoos are the fastest way to close the gap.',
  55: 'Register stolen vehicles with Moses — needs garage parking spots first.',
  14: 'The last gold: 100% completion. Clear the checklist category by category, then the platinum pops.',
  1: 'The platinum itself — it pops the moment the other 54 are earned.',
};

export function plannerWhy(trophy) {
  if (PLANNER_WHY[trophy.id]) return PLANNER_WHY[trophy.id];
  if (trophy.stage === 1) return 'Story progress — play the missions in order and it pops on completion.';
  if (trophy.stage === 2) return 'A side strand — do its quests as the markers appear; it stays available after the story.';
  if (trophy.stage === 3) return 'A collectible — fold it into the region-by-region map sweep.';
  if (trophy.stage === 4) return 'An activity — try it between story missions; most land on their own.';
  if (trophy.stage === 5) return 'Money or mayhem — do it in free roam once the activity is unlocked.';
  return 'Cleanup — the last step before the platinum.';
}

export function nextUnearnedTrophies(trophies, earnedIds, limit = 10) {
  return trophiesInRoadmapOrder(trophies)
    .filter((trophy) => !earnedIds.has(trophy.id))
    .slice(0, limit);
}

export function renderPlanner(container, trophies, earnedIds, hideSpoilers) {
  const next = nextUnearnedTrophies(trophies, earnedIds, 10);
  container.replaceChildren();
  // Round 4: a plain count line up top, so the planner says how much of the
  // list you are seeing instead of leaving the 10-item cut unexplained.
  const unearnedCount = trophies.filter((trophy) => !earnedIds.has(trophy.id)).length;
  const summary = document.createElement('li');
  summary.className = 'planner-summary muted';
  summary.textContent = `Showing the next ${next.length} of ${unearnedCount} unearned — in roadmap order.`;
  container.append(summary);
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
    const why = document.createElement('div');
    why.className = 'planner-why';
    why.textContent = `Why next: ${plannerWhy(trophy)}`;
    body.append(name, detail, why);
    item.append(rank, body);
    container.append(item);
  });
}
