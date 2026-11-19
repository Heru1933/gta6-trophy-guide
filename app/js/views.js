// Checklist view: the trophy cards, and the detail pane with guide + sources.
import { applyChecklistFilters, displayDescription, displayName, isSpoilerHidden } from './filters.js';
import { KIND_LABELS } from './data.js';

export function renderKindCounters(container, trophies, earnedIds) {
  const kinds = ['story', 'missable', 'collectibles', 'activities'];
  const parts = kinds.map((kind) => {
    const pool = kind === 'missable'
      ? trophies.filter((t) => t.missable || t.watch)
      : trophies.filter((t) => t.kind === kind);
    const earned = pool.filter((t) => earnedIds.has(t.id)).length;
    return `<strong>${KIND_LABELS[kind]}</strong> ${earned}/${pool.length}`;
  });
  container.innerHTML = parts.join(' &nbsp;·&nbsp; ');
}

export function renderChecklist(listElement, trophies, state, onSelect, onToggleEarned) {
  const visible = applyChecklistFilters(trophies, state.filters);
  listElement.replaceChildren();
  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No trophies match those filters — clear the search or widen the kind and grade.';
    listElement.append(empty);
    return;
  }
  for (const trophy of visible) {
    const item = document.createElement('li');
    item.className = 'trophy-card' + (state.earnedIds.has(trophy.id) ? ' earned' : '')
      + (state.selectedId === trophy.id ? ' selected' : '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state.earnedIds.has(trophy.id);
    checkbox.setAttribute('aria-label', `Mark ${displayName(trophy, state.hideSpoilers, state.earnedIds)} as earned`);
    checkbox.addEventListener('click', (event) => {
      // Keep the tick from also selecting the card: the re-render that follows
      // selection would destroy this checkbox before its change event fires.
      event.stopPropagation();
    });
    checkbox.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggleEarned(trophy.id, checkbox.checked);
    });
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy, state.hideSpoilers, state.earnedIds);
    const badge = document.createElement('span');
    badge.className = `grade-badge ${trophy.grade}`;
    badge.textContent = trophy.grade;
    name.append(badge);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy, state.hideSpoilers, state.earnedIds);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const kind = document.createElement('span');
    kind.textContent = `${KIND_LABELS[trophy.kind]} · Stage ${trophy.stage}`;
    meta.append(kind);
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'flag missable';
      flag.textContent = 'Missable';
      meta.prepend(flag);
    } else if (trophy.watch) {
      const flag = document.createElement('span');
      flag.className = 'flag watch';
      flag.textContent = 'Watch list';
      meta.prepend(flag);
    }
    body.append(name, desc, meta);
    const guideHint = document.createElement('span');
    guideHint.className = 'trophy-meta';
    guideHint.textContent = 'Guide →';
    item.append(checkbox, body, guideHint);
    item.addEventListener('click', () => onSelect(trophy.id));
    listElement.append(item);
  }
}

export function renderDetail(detailElement, trophy, state, onSaveNote) {
  if (!trophy) {
    detailElement.innerHTML = '';
    const heading = document.createElement('h2');
    heading.textContent = 'Pick a trophy';
    const text = document.createElement('p');
    text.textContent = 'Click any trophy in the checklist to read its guide and sources here. Every guide is written in our own words and cites where each fact comes from.';
    detailElement.append(heading, text);
    return;
  }
  const hidden = isSpoilerHidden(trophy, state.hideSpoilers, state.earnedIds);
  detailElement.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = hidden ? 'Hidden trophy' : trophy.name;
  const grade = document.createElement('p');
  grade.className = 'muted';
  grade.textContent = `${trophy.grade[0].toUpperCase()}${trophy.grade.slice(1)} · ${KIND_LABELS[trophy.kind]} · Stage ${trophy.stage}${trophy.missable ? ' · Missable' : ''}${trophy.watch ? ' · Watch list' : ''}`;
  const official = document.createElement('div');
  official.className = 'official';
  const officialTitle = document.createElement('h3');
  officialTitle.textContent = 'Official description';
  const officialText = document.createElement('p');
  officialText.textContent = hidden ? 'Hidden on PlayStation until earned.' : trophy.description;
  official.append(officialTitle, officialText);
  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'Guide';
  const guideText = document.createElement('p');
  guideText.textContent = hidden
    ? 'This is a story trophy, so its guide stays hidden until you earn it. Tick it earned in the checklist to reveal the guide.'
    : trophy.guide;
  const sourcesTitle = document.createElement('h3');
  sourcesTitle.textContent = 'Sources';
  const sourcesList = document.createElement('ul');
  sourcesList.className = 'sources';
  for (const source of trophy.sources || []) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.label;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    sourcesList.append(item);
  }
  const noteTitle = document.createElement('h3');
  noteTitle.textContent = 'Your note';
  const noteBox = document.createElement('div');
  noteBox.className = 'note-box';
  const noteArea = document.createElement('textarea');
  noteArea.value = state.notes[trophy.id] || '';
  noteArea.placeholder = 'Your own note — where you found it, what worked…';
  noteArea.setAttribute('aria-label', 'Your note for this trophy');
  noteArea.addEventListener('change', () => onSaveNote(trophy.id, noteArea.value));
  noteBox.append(noteArea);
  detailElement.append(heading, grade, official, guideTitle, guideText, sourcesTitle, sourcesList, noteTitle, noteBox);
}
