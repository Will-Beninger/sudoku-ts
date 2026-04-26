# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> game screen >> e2e: game controls are visible and interactive
- Location: src\tests\smoke.spec.ts:73:5

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.level-pack-header').filter({ hasText: 'Classic Easy' })

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - button "←" [ref=e6] [cursor=pointer]
    - heading "Select Level" [level=1] [ref=e7]
  - generic [ref=e8]:
    - button "Classic Easy ▸" [ref=e10] [cursor=pointer]:
      - generic [ref=e11]: Classic Easy
      - generic [ref=e12]: ▸
    - button "Classic Medium ▸" [ref=e14] [cursor=pointer]:
      - generic [ref=e15]: Classic Medium
      - generic [ref=e16]: ▸
    - button "Classic Hard ▸" [ref=e18] [cursor=pointer]:
      - generic [ref=e19]: Classic Hard
      - generic [ref=e20]: ▸
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('smoke: app renders without crashing', async ({ page }) => {
  4  |     await page.goto('./');
  5  | 
  6  |     const root = page.locator('#root');
  7  |     await expect(root).toBeVisible();
  8  | 
  9  |     page.on('console', msg => {
  10 |         if (msg.type() === 'error') throw new Error(`Console Error: ${msg.text()}`);
  11 |     });
  12 | });
  13 | 
  14 | test.describe('game screen', () => {
  15 |     test.beforeEach(async ({ page }) => {
  16 |         await page.goto('./');
  17 |         // Navigate through the new flow
  18 |         await page.locator('#btn-play').click();
> 19 |         await page.locator('.ls-pack-header', { hasText: 'Classic Easy' }).click();
     |                                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  20 |         await page.locator('.ls-puzzle-item').first().click();
  21 |         // Wait for board to load
  22 |         await page.waitForSelector('.sudoku-board');
  23 |     });
  24 | 
  25 |     test('e2e: grid renders 81 cells', async ({ page }) => {
  26 |         const cells = page.locator('.sudoku-cell');
  27 |         await expect(cells).toHaveCount(81);
  28 |     });
  29 | 
  30 |     test('e2e: clicking a cell selects it', async ({ page }) => {
  31 |         // Find a non-fixed (user-input) cell and click it
  32 |         const userCell = page.locator('.sudoku-cell.user-input').first();
  33 |         await userCell.click();
  34 | 
  35 |         await expect(userCell).toHaveClass(/selected/);
  36 |     });
  37 | 
  38 |     test('e2e: number pad input updates cell', async ({ page }) => {
  39 |         // Click first empty cell
  40 |         const userCell = page.locator('.sudoku-cell.user-input').first();
  41 |         await userCell.click();
  42 |         await expect(userCell).toHaveClass(/selected/);
  43 | 
  44 |         // Click number 4 on the pad
  45 |         const btn4 = page.locator('.num-btn', { hasText: '4' });
  46 |         await btn4.click();
  47 | 
  48 |         // The cell should now show the value
  49 |         await expect(userCell.locator('.cell-value')).toHaveText('4');
  50 |     });
  51 | 
  52 |     test('e2e: undo reverts last input', async ({ page }) => {
  53 |         const userCell = page.locator('.sudoku-cell.user-input').first();
  54 |         await userCell.click();
  55 | 
  56 |         // Input a number
  57 |         await page.locator('.num-btn', { hasText: '7' }).click();
  58 |         await expect(userCell.locator('.cell-value')).toHaveText('7');
  59 | 
  60 |         // Click undo
  61 |         await page.locator('.control-btn', { hasText: 'Undo' }).click();
  62 | 
  63 |         // Cell should be empty again
  64 |         await expect(userCell.locator('.cell-value')).toHaveCount(0);
  65 |     });
  66 | 
  67 |     test('e2e: timer is visible', async ({ page }) => {
  68 |         const timer = page.locator('.timer');
  69 |         await expect(timer).toBeVisible();
  70 |         await expect(timer).toHaveText(/\d{2}:\d{2}/);
  71 |     });
  72 | 
  73 |     test('e2e: game controls are visible and interactive', async ({ page }) => {
  74 |         await expect(page.locator('.control-btn', { hasText: 'Undo' })).toBeVisible();
  75 |         await expect(page.locator('.control-btn', { hasText: 'Erase' })).toBeVisible();
  76 |         await expect(page.locator('.control-btn', { hasText: /Notes/ })).toBeVisible();
  77 |         await expect(page.locator('.control-btn', { hasText: 'Hint' })).toBeVisible();
  78 | 
  79 |         // Toggle note mode
  80 |         const noteBtn = page.locator('.control-btn', { hasText: /Notes/ });
  81 |         await noteBtn.click();
  82 |         await expect(noteBtn).toHaveClass(/active/);
  83 |         await noteBtn.click();
  84 |         await expect(noteBtn).not.toHaveClass(/active/);
  85 |     });
  86 | });
```