const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'potatoscript';
const REPO = 'node-auth-app';

async function updateUsersJson() {
  try {
    // Fetch all open issues with label "registration"
    const response = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/issues?state=open&labels=registration`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const issues = response.data;

    if (issues.length === 0) {
      console.log('No new registration issues to process.');
      return;
    }

    // Path to users.json
    const usersFilePath = path.join(__dirname, '../data/users.json');
    const usersFile = fs.readFileSync(usersFilePath, 'utf8');
    let users = JSON.parse(usersFile);

    for (const issue of issues) {
      const title = issue.title;
      const body = issue.body;

      // Extract username and password
      const username = title.replace('New Registration: ', '').trim();

      const passwordMatch = body.match(/\*\*Password:\*\* (.+)/);
      if (!passwordMatch) {
        console.error(`Cannot extract password from issue #${issue.number}`);
        continue; // Skip this issue
      }
      const password = passwordMatch[1].trim();

      // Add user
      users.push({ username, password });

      // Close the issue
      await axios.patch(
        `https://api.github.com/repos/${OWNER}/${REPO}/issues/${issue.number}`,
        { state: 'closed' },
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );

      console.log(`Processed and closed issue #${issue.number}`);
    }

    // Write updated users.json
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    console.log('users.json updated successfully!');

  } catch (error) {
    console.error('Error updating users.json:', error.message || error);
  }
}

updateUsersJson();
