// Saved progress: earned trophies and per-trophy notes, kept in localStorage.
// Export writes a JSON file; import reads one back. Nothing leaves the browser.
export const PROGRESS_KEY = 'leonida-platinum-progress-v1';
export const SETTINGS_KEY = 'leonida-platinum-settings-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { earned: [], notes: {} };
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter((id) => Number.isInteger(id)) : [],
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
    };
  } catch {
    return { earned: [], notes: {} };
  }
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportProgressFile(progress) {
  const blob = new Blob([exportProgressJson(progress)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-platinum-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Round 3: the export as a plain string, so the file writer above and any
// future backup view share one serialization — and so the exported file is
// exactly the progress the app holds, notes included.
export function exportProgressJson(progress) {
  return JSON.stringify(progress, null, 2);
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  // Round 4: also accept a wrapped export ({ progress: {...} }), so a file
  // re-saved by another tool with the progress nested one level down still
  // imports instead of silently restoring nothing.
  const body = parsed.progress && typeof parsed.progress === 'object' ? parsed.progress : parsed;
  const earned = Array.isArray(body.earned) ? body.earned : (Array.isArray(body) ? body : []);
  return {
    earned: earned.filter((id) => Number.isInteger(id)),
    notes: body.notes && typeof body.notes === 'object' ? body.notes : {},
  };
}
