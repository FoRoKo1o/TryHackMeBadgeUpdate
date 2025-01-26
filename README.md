# TryHackMeBadgeUpdate - tests in progress!

Since TryHackMe shares user profile badge only as `iframe` or static IMG, that has to be manually updated. I came up with this simple Node.js script.

## How it works?
1. `Puppeteer` is used to take a screenshot of `Iframe` and save it into .png format.
2.  Screenshot is moved to `_special_ ✨` repository (Named same as GitHub profile)
3. `SimpleGit` is responsible for committing new changes.
4. Script is deployed on [VPS](https://mikr.us/).

## How to setup?
1. Define variables
```
const url = 'https://tryhackme.com/api/v2/badges/public-profile?userPublicId={ChangeToYourID}';
const repoPath = '{ChangeToYourSpecialRepoPathOnDisck}';
```
2. Install dependencies
 ```
sudo apt-get install chromium-browser
```
3. Create repo SSH access
```
ssh-keygen -t test -C "your_email@example.com"
```
Put the private key inside: `~/.ssh/`.

And public one in GitHub settings.

Make Git use SSH `git remote set-url origin git@github.com:username/repository.git`

## How to run daily?
1. On VPS, enter `crontab -e`
2. Add new line `0 0 * * * node /path/to/file/tryhackme_badge_update.js`

## For testing purposes
1. change to, for example`*/3 * * * * node /.../` - that will make it run every 3 minutes.
2. Change `logFile` output path to desired badge location.

### See in action
[My GitHub profile :)](https://github.com/FoRoKo1o)
