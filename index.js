const puppeteer = require('puppeteer');
const simpleGit = require('simple-git');
const path = require('path');

(async () => {
  const url = 'ChangeToYoursTHMbadgeURL';
  const outputPath = './thmBadge.png';
  const repoPath = `ChangeToLocalRepoPath`;
  const commitMessage = 'Automatyczny commit: Zaktualizowano screenshot';
  
  try {
    // Uruchom Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
