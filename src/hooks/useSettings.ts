import { useState, useEffect, useCallback } from 'react';
import { atom, useAtom } from 'jotai';
import type { AppSettings } from '../services/settingsService';
import { loadSettings, saveSettings } from '../services/settingsService';

const settingsAtom = atom<AppSettings>({
  id: 1,
  darkMode: true,
  highlightRowCol: false,
  highlightSameNumber: false,
  greyOutCompleted: false,
});

const settingsLoadedAtom = atom(false);

export function useSettings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [loaded, setLoaded] = useAtom(settingsLoadedAtom);
  const [isLoading, setIsLoading] = useState(!loaded);

  // Load settings from IndexedDB on first use
  useEffect(() => {
    if (loaded) return;
    void loadSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
      setIsLoading(false);
    });
  }, [loaded, setSettings, setLoaded]);

  // Apply dark/light class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (settings.darkMode) {
      html.classList.remove('light');
    } else {
      html.classList.add('light');
    }
  }, [settings.darkMode]);

  const updateSetting = useCallback(
    <K extends keyof Omit<AppSettings, 'id'>>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      void saveSettings({ [key]: value });
    },
    [setSettings],
  );

  return {
    settings,
    isLoading,
    updateSetting,
  };
}
