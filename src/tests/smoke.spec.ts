import { test, expect } from '@playwright/test';

test('smoke: app renders without crashing', async ({ page }) => {
    await page.goto('./');

    const root = page.locator('#root');
    await expect(root).toBeVisible();

    page.on('console', msg => {
        if (msg.type() === 'error') throw new Error(`Console Error: ${msg.text()}`);
    });
});

test('e2e: grid renders 81 cells', async ({ page }) => {
    await page.goto('./');
    const cells = page.locator('.sudoku-cell');
    await expect(cells).toHaveCount(81);
});

test('e2e: clicking a cell selects it', async ({ page }) => {
    await page.goto('./');

    // Find a non-fixed (user-input) cell and click it
    const userCell = page.locator('.sudoku-cell.user-input').first();
    await userCell.click();

    await expect(userCell).toHaveClass(/selected/);
});

test('e2e: number pad input updates cell', async ({ page }) => {
    await page.goto('./');

    // Click first empty cell
    const userCell = page.locator('.sudoku-cell.user-input').first();
    await userCell.click();
    await expect(userCell).toHaveClass(/selected/);

    // Click number 4 on the pad
    const btn4 = page.locator('.num-btn', { hasText: '4' });
    await btn4.click();

    // The cell should now show the value
    await expect(userCell.locator('.cell-value')).toHaveText('4');
});

test('e2e: undo reverts last input', async ({ page }) => {
    await page.goto('./');

    const userCell = page.locator('.sudoku-cell.user-input').first();
    await userCell.click();

    // Input a number
    await page.locator('.num-btn', { hasText: '7' }).click();
    await expect(userCell.locator('.cell-value')).toHaveText('7');

    // Click undo
    await page.locator('.control-btn', { hasText: 'Undo' }).click();

    // Cell should be empty again
    await expect(userCell.locator('.cell-value')).toHaveCount(0);
});

test('e2e: timer is visible', async ({ page }) => {
    await page.goto('./');

    const timer = page.locator('.timer');
    await expect(timer).toBeVisible();
    await expect(timer).toHaveText(/\d{2}:\d{2}/);
});

test('e2e: game controls are visible and interactive', async ({ page }) => {
    await page.goto('./');

    await expect(page.locator('.control-btn', { hasText: 'Undo' })).toBeVisible();
    await expect(page.locator('.control-btn', { hasText: 'Erase' })).toBeVisible();
    await expect(page.locator('.control-btn', { hasText: /Notes/ })).toBeVisible();
    await expect(page.locator('.control-btn', { hasText: 'Hint' })).toBeVisible();

    // Toggle note mode
    const noteBtn = page.locator('.control-btn', { hasText: /Notes/ });
    await noteBtn.click();
    await expect(noteBtn).toHaveClass(/active/);
    await noteBtn.click();
    await expect(noteBtn).not.toHaveClass(/active/);
});