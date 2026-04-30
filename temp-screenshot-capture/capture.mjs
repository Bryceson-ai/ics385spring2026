import { chromium } from "playwright";

const outputDir = "C:/Users/bryce/OneDrive/Desktop/ics385spring2026/week13/term-project/docs/screenshots";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 3200 } });

await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "View Dashboard" }).first().click();
await page.waitForTimeout(2500);

await page.screenshot({ path: `${outputDir}/dashboard-all-charts.png`, fullPage: true });

const chartCards = await page.locator(".chart-card").all();
for (let i = 0; i < chartCards.length; i += 1) {
  await chartCards[i].screenshot({ path: `${outputDir}/chart-${i + 1}.png` });
}

await browser.close();
console.log(`Saved ${chartCards.length + 1} screenshots to ${outputDir}`);
