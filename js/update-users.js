const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Get GitHub token from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// GitHub repository URL
const GITHUB_API_URL = 'https://api.github.com/repos/heartlanguage2024/auth-app-github/issues';

async function updateUsersJson() {
  try {
    // Fetch the issues from the GitHub repository
    const response = await axios.get(GITHUB_API_URL, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    // Extract the data from the latest issue
    const issue = response.data[0]; // Assume the latest issue is the most recent registration
    const username = issue.title.replace('New user registration: ', '').trim();
    const password = issue.body.match(/Password: (.*)/)[1].trim();  // Extract password from issue body

    // Path to the users.json file in the data folder
    const usersFilePath = path.join(__dirname, '../data/users.json');

    // Read the current users.json file
    const usersFile = fs.readFileSync(usersFilePath, 'utf8');
    let users = JSON.parse(usersFile);

    // Add the new user to the array
    users.push({ username, password });

    // Write the updated array back to users.json
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    console.log('users.json updated successfully!');

    // Now, close the issue
    const issueNumber = issue.number; // Get the issue number from the response

    // Prepare the data to close the issue
    const closeIssueData = {
      state: 'closed' // Close the issue
    };

    // GitHub API request to close the issue
    await axios.patch(
      `https://api.github.com/repos/heartlanguage2024/auth-app-github/issues/${issueNumber}`,
      closeIssueData,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    console.log(`Issue #${issueNumber} has been closed successfully.`);
  } catch (error) {
    console.error('Error updating users.json or closing the issue:', error);
  }
}

updateUsersJson();
