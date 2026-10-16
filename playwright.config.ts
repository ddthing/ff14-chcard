import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
    testDir: './tests', fullyParallel: false, workers: 1, timeout: 60_000,
    use: { baseURL: 'http://127.0.0.1:5173', viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce',
        launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] } },
    webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI },
});
