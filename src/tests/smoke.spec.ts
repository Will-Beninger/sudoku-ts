import { test, expect } from '@playwright/test';

test('smoke: app renders without crashing', async ({ page }) => {
    await page.goto('/');

    // Verify the main app container exists (adjust selector for your app)
    const root = page.locator('#root');
    await expect(root).toBeVisible();

    // Verify no massive JS errors in the console
    page.on('console', msg => {
        if (msg.type() === 'error') throw new Error(`Console Error: ${msg.text()}`);
    });
});