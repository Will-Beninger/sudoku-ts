import { db } from './db';

export interface AppSettings {
  id: number;
  darkMode: boolean;
  highlightRowCol: boolean;
  highlightSameNumber: boolean;
  greyOutCompleted: boolean;
}

const DEFAULTS: AppSettings = {
  id: 1,
  darkMode: true,
  highlightRowCol: false,
  highlightSameNumber: false,
  greyOutCompleted: false,
};

export async function loadSettings(): Promise<AppSettings> {
  const stored = await db.settings.get(1);
  if (stored) return stored;
  // Initialize with defaults on first load
  await db.settings.put(DEFAULTS);
  return DEFAULTS;
}

export async function saveSettings(settings: Partial<Omit<AppSettings, 'id'>>): Promise<void> {
  await db.settings.update(1, settings);
}
