import { atom } from 'jotai';

export type AppRoute =
  | { screen: 'menu' }
  | { screen: 'levelSelect' }
  | { screen: 'game'; puzzleId: string }
  | { screen: 'game'; resumeSave: true }
  | { screen: 'statistics' }
  | { screen: 'options' };

export const routeAtom = atom<AppRoute>({ screen: 'menu' });

export function navigateTo(route: AppRoute): AppRoute {
  return route;
}
