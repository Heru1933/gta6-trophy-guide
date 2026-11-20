// Boot + routing for Leonida Platinum: loads the trophies, wires the controls,
// keeps the header progress honest, and switches between the five views.
import { loadTrophies, trophyById, trophiesInRoadmapOrder } from './data.js';
import { loadProgress, saveProgress, loadSettings, saveSettings, exportProgressFile, importProgressFile } from './store.js';
import { renderChecklist, renderDetail, renderKindCounters } from './views.js';
import { renderRoadmap } from './roadmap.js';
import { renderMissables } from './missables.js';
import { renderPlanner } from './planner.js';

const VIEWS = ['checklist', 'roadmap', 'missables', 'planner', 'settings'];

const state = {
  trophies: [],
  progress: loadProgress(),
  settings: loadSettings(),
  filters: { query: '', kind: 'all', grade: 'all', unearnedOnly: false },
  hideSpoilers: true,
  selectedId: null,
};

function getEarnedIds() {
  return new Set(state.progress.earned);
}

function applyUrlOptions() {
  // Demo controls for screenshots: ?seed=20 earns the first 20 trophies in roadmap
  // order in this browser only — exactly through Positive Mental Attitude, so the
  // one possibly missable trophy shows earned and revealed; ?spoilers=off turns
  // the spoiler setting off; ?open=<id> opens that trophy's guide. All of it is
  // local demo state.
  const params = new URLSearchParams(location.search);
  if (params.get('spoilers') === 'off') {
    state.hideSpoilers = false;
    state.settings.hideSpoilers = false;
    saveSettings(state.settings);
  }
  const seed = Number(params.get('seed'));
  if (!Number.isInteger(seed) || seed <= 0) return;
  const ordered = trophiesInRoadmapOrder(state.trophies);
  state.progress.earned = ordered.slice(0, Math.min(seed, ordered.length)).map((trophy) => trophy.id);
  saveProgress(state.progress);
  const openId = Number(params.get('open'));
  if (Number.isInteger(openId) && trophyById(state.trophies, openId)) state.selectedId = openId;
}

function readViewFromHash() {
  const match = location.hash.match(/^#\/(\w+)/);
  return match && VIEWS.includes(match[1]) ? match[1] : 'checklist';
}

function showView(view) {
  for (const name of VIEWS) {
    document.getElementById(`view-${name}`).hidden = name !== view;
    const tab = document.querySelector(`.tabs a[data-view="${name}"]`);
    if (tab) {
      if (name === view) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    }
  }
  if (view === 'roadmap') renderRoadmap(document.getElementById('roadmap'), state.trophies, getEarnedIds(), state.hideSpoilers);
  if (view === 'missables') renderMissables(document.getElementById('missable-list'), state.trophies, { ...state, earnedIds: getEarnedIds() });
  if (view === 'planner') renderPlanner(document.getElementById('planner-list'), state.trophies, getEarnedIds(), state.hideSpoilers);
}

function renderAll() {
  const earnedIds = getEarnedIds();
  const earnedCount = document.getElementById('earned-count');
  earnedCount.textContent = String(earnedIds.size);
  document.getElementById('total-count').textContent = String(state.trophies.length);
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${(earnedIds.size / state.trophies.length) * 100}%`;
  document.getElementById('progress-bar').setAttribute('aria-valuenow', String(earnedIds.size));
  const viewState = { ...state, earnedIds, notes: state.progress.notes };
  renderKindCounters(document.getElementById('kind-counters'), state.trophies, earnedIds);
  renderChecklist(document.getElementById('trophy-list'), state.trophies, viewState, selectTrophy, toggleEarned);
  renderDetail(
    document.getElementById('detail'),
    state.selectedId ? trophyById(state.trophies, state.selectedId) : null,
    viewState,
    saveNote,
  );
  showView(readViewFromHash());
}

function selectTrophy(id) {
  state.selectedId = id;
  renderAll();
}

function toggleEarned(id, earned) {
  const set = getEarnedIds();
  if (earned) set.add(id);
  else set.delete(id);
  state.progress.earned = [...set];
  saveProgress(state.progress);
  renderAll();
}

function saveNote(id, text) {
  if (text.trim()) state.progress.notes[id] = text;
  else delete state.progress.notes[id];
  saveProgress(state.progress);
}

function applyTheme() {
  const theme = state.settings.theme || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
}

function wireControls() {
  const search = document.getElementById('search');
  search.addEventListener('input', () => { state.filters.query = search.value; renderAll(); });
  document.getElementById('kind-filter').addEventListener('change', (event) => { state.filters.kind = event.target.value; renderAll(); });
  document.getElementById('grade-filter').addEventListener('change', (event) => { state.filters.grade = event.target.value; renderAll(); });
  document.getElementById('earned-filter').addEventListener('change', (event) => { state.filters.unearnedOnly = event.target.checked; renderAll(); });

  const spoilerBoxes = [document.getElementById('spoiler-toggle'), document.getElementById('spoiler-toggle-settings')];
  const setSpoilers = (value) => {
    state.hideSpoilers = value;
    state.settings.hideSpoilers = value;
    saveSettings(state.settings);
    spoilerBoxes.forEach((box) => { box.checked = value; });
    renderAll();
  };
  spoilerBoxes.forEach((box) => box.addEventListener('change', () => setSpoilers(box.checked)));
  if (typeof state.settings.hideSpoilers === 'boolean') state.hideSpoilers = state.settings.hideSpoilers;
  spoilerBoxes.forEach((box) => { box.checked = state.hideSpoilers; });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    state.settings.theme = (state.settings.theme || 'light') === 'dark' ? 'light' : 'dark';
    saveSettings(state.settings);
    applyTheme();
  });
  document.getElementById('export-btn').addEventListener('click', () => {
    exportProgressFile(state.progress);
    document.getElementById('settings-status').textContent = 'Progress exported.';
  });
  // Round 3: the same export/import, visible in the checklist toolbar so the
  // cover screenshot shows the tracker can back up and restore its progress.
  document.getElementById('export-btn-checklist').addEventListener('click', () => {
    exportProgressFile(state.progress);
    document.getElementById('checklist-status').textContent = 'Progress exported.';
  });
  document.getElementById('import-file-checklist').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state.progress = await importProgressFile(file);
      saveProgress(state.progress);
      document.getElementById('checklist-status').textContent = `Imported ${state.progress.earned.length} earned trophies.`;
      renderAll();
    } catch {
      document.getElementById('checklist-status').textContent = 'That file could not be read as progress — export first, then import the same file.';
    }
  });
  document.getElementById('import-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state.progress = await importProgressFile(file);
      saveProgress(state.progress);
      document.getElementById('settings-status').textContent = `Imported ${state.progress.earned.length} earned trophies.`;
      renderAll();
    } catch {
      document.getElementById('settings-status').textContent = 'That file could not be read as progress — export first, then import the same file.';
    }
  });
  document.getElementById('reset-btn').addEventListener('click', () => {
    state.progress = { earned: [], notes: {} };
    saveProgress(state.progress);
    document.getElementById('settings-status').textContent = 'Progress reset.';
    renderAll();
  });
  window.addEventListener('hashchange', () => showView(readViewFromHash()));
}

async function bootLeonidaPlatinum() {
  state.trophies = await loadTrophies();
  applyUrlOptions();
  applyTheme();
  wireControls();
  renderAll();
}

bootLeonidaPlatinum();
