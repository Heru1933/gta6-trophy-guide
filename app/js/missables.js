// Missables view: the one reported missable, then the watch list of one-shot moments.
import { displayDescription, displayName, isSpoilerHidden } from './filters.js';

export function renderMissables(container, trophies, state) {
  container.replaceChildren();
  const missable = trophies.filter((trophy) => trophy.missable === true);
  const watch = trophies.filter((trophy) => trophy.watch === true);
  container.append(missableSection('Confirmed missable', missable, state, 'Reported as possibly missable by GTABase and PowerPyx.'));
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
    body.append(name, desc, guide);
    item.append(checkbox, body);
    list.append(item);
  }
  section.append(heading, noteElement, list);
  return section;
}
