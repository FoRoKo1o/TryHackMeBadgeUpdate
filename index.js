
const puppeteer = require('puppeteer');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

(async () => {
  const url = 'https://tryhackme.com/api/v2/badges/public-profile?userPublicId=3195715';
  const outputPath = 'thmBadge.png';
  const repoPath = `/home/FoRoKo1o`;
  const commitMessage = 'Automatyczny commit: Zaktualizowano screenshot';

 console.log(`test`);
  try {
    // Uruchom Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
//      dumpio: true,
    });

    const page = await browser.newPage();
    console.log(`Otwieram stronę: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Zapisz zrzut ekranu
    await page.screenshot({
      path: outputPath,
      clip: {
        x: 1,
        y: 1,
        width: 324,
        height: 82,
      },
    });
    console.log(`Screenshot zapisany jako ${outputPath}`);

    await browser.close();

    const destinationPath = path.join(repoPath, 'thmBadge.png');
    fs.copyFileSync(outputPath, destinationPath);
    console.log(`Zrzut ekranu skopiowany do repozytorium: ${destinationPath}`);

    const git = simpleGit(repoPath);
    await git.pull('origin', 'main');

    // Dodaj screenshot do repozytorium
    console.log('Dodawanie screenshotu do repozytorium...');
    await git.add(path.join(repoPath, 'thmBadge.png'));

    // Wykonaj commit
    console.log(`Commit: ${commitMessage}`);
    await git.commit(commitMessage);

    // Wykonaj push
    console.log('Wykonywanie pusha...');
    await git.push();

    console.log('Push zakończony sukcesem!');

  } catch (err) {
    console.error('Wystąpił błąd:', err);
  }
})();
