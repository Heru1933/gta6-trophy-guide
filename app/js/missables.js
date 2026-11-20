// Missables view: the one reported possibly missable trophy, then the watch
// list of one-shot moments. Round 3: the heading no longer calls anything
// "confirmed" — PowerPyx and GTABase report it as possibly missable and
// neither confirms it is required — and the view explains why the trophy is
// visible here: it is shown earned, which is what reveals a hidden trophy
// under the spoiler setting. The setting itself is never switched off.
import { displayDescription, displayName, isSpoilerHidden } from './filters.js';

export function renderMissables(container, trophies, state) {
  container.replaceChildren();
  const revealNote = document.createElement('p');
  revealNote.className = 'muted missable-note';
  revealNote.textContent = 'Earned trophies reveal themselves: a hidden trophy\u2019s name, description and guide stay hidden until you tick it earned — that is the spoiler setting working, not a gap. The demo profile used for the screenshots has Positive Mental Attitude earned, so it shows here in full.';
  container.append(revealNote);
  const missable = trophies.filter((trophy) => trophy.missable === true);
  const watch = trophies.filter((trophy) => trophy.watch === true);
  container.append(missableSection('Reported possibly missable', missable, state, 'PowerPyx and GTABase both flag Positive Mental Attitude as the only trophy that might be missable: the Chapter 1 balcony meditation at Jason\u2019s house. Neither confirms it is required — do it in Chapter 1 and the question never matters.'));
  container.append(missableSection('Watch list — one-shot moments, not confirmed missable', watch, state, 'Do these carefully; each can be retried in free roam as far as the official list shows.'));
}

function missableSection(title, trophies, state, note) {
  const section = document.createElement('section');
  const heading = document.createElement('h3');
  heading.textContent = `${title} (${trophies.length})`;
  const noteElement = document.createElement('p');
  noteElement.className = 'muted';
  noteElement.textContent = note;
  const list = document.createElement('ul');
  list.className = 'trophy-list';
  for (const trophy of trophies) {
    const item = document.createElement('li');
    item.className = 'trophy-card' + (state.earnedIds.has(trophy.id) ? ' earned' : '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state.earnedIds.has(trophy.id);
    checkbox.disabled = true;
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy, state.hideSpoilers, state.earnedIds);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy, state.hideSpoilers, state.earnedIds);
    const guide = document.createElement('p');
    guide.textContent = isSpoilerHidden(trophy, state.hideSpoilers, state.earnedIds)
      ? 'Guide hidden until this trophy is earned.'
      : trophy.guide;
    const sources = document.createElement('p');
    sources.className = 'trophy-meta';
    sources.textContent = isSpoilerHidden(trophy, state.hideSpoilers, state.earnedIds)
      ? ''
      : `Sources: ${(trophy.sources || []).map((source) => source.label.split(' — ')[0]).join(', ')}.`;
    body.append(name, desc, guide, sources);
    item.append(checkbox, body);
    list.append(item);
  }
  section.append(heading, noteElement, list);
  return section;
}
