const puppeteer = require('puppeteer');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Ustawienie ścieżki do pliku logu
const logFile = '/home/TryHackMeBadgeUpdate/log.txt';

// Zapisz datę uruchomienia skryptu do logów
fs.appendFileSync(logFile, `Skrypt uruchomiony: ${new Date()}\n`);

// Funkcja do załadowania klucza SSH
function loadSSHKey() {
  return new Promise((resolve, reject) => {
    exec('eval $(ssh-agent -s) && ssh-add /root/.ssh/test', (error, stdout, stderr) => {
      if (error) {
        reject(`Błąd podczas ładowania klucza SSH: ${stderr || error}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

(async () => {
  const url = 'https://tryhackme.com/api/v2/badges/public-profile?userPublicId=3195715';
  const outputPath = 'thmBadge.png';
  const repoPath = '/home/FoRoKo1o';
  const commitMessage = 'Automatyczny commit: Zaktualizowano screenshot';

  try {
    // Załaduj klucz SSH przed rozpoczęciem operacji Gita
    console.log('Ładowanie klucza SSH...');
    await loadSSHKey();
    console.log('Klucz SSH załadowany.');

    // Uruchom Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
    });

    const page = await browser.newPage();
    console.log(`Otwieram stronę: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Zapisz zrzut ekranu
    await page.screenshot({
      path: outputPath,
      clip: {
        x: 5,
        y: 5,
        width: 318,
        height: 72,
      },
    });
    console.log(`Screenshot zapisany jako ${outputPath}`);

    await browser.close();

    process.env.GIT_SSH_COMMAND = '/usr/bin/ssh -i /root/.ssh/test';
    process.env.PATH = '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin';

    // Skopiuj plik do repozytorium
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

    //await git.push();
    await git.push('origin', 'main', { '--verbose': true });

    console.log('Push zakończony sukcesem!');

  } catch (err) {
    console.error('Wystąpił błąd:', err);
  }
})();
