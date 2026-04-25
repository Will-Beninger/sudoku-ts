export interface SudokuCell {
  value: number | null;
  isFixed: boolean;
  isValid: boolean;
  notes: Set<number>;
}
