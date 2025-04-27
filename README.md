## 🎯 **Complete working minimal authentication app** using:

- ✅ A simple HTML form  
- ✅ GitHub Issues to "register" a user  
- ✅ GitHub Actions to write that user into `data/users.json`  
- ✅ With node express server as local backend

---

### 🗂 Folder Structure

```
node-auth-app/
├── index.html
├── js/
│   └── main.js
|   └── update-users.js
├── data/
│   └── users.json
├── .github/
|   └── workflows/
|       └── update-users.yml
├── package.json
└── package-lock.json
```

---

### 🔵 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mini Auth App</title>
  <style>
    body { font-family: sans-serif; margin: 2em; }
    label, input { display: block; margin-bottom: 1em; }
    button { padding: 0.5em 1em; }
  </style>
</head>
<body>
  <h1>🧑‍💻 Register</h1>
  <form id="register-form">
    <label>
      Username:
      <input type="text" id="username" required />
    </label>
    <label>
      Password:
      <input type="password" id="password" required />
    </label>
    <button type="submit">Register</button>
  </form>

  <script src="js/main.js"></script>
</body>
</html>
```

---

### 🟨 `js/main.js`

```js
document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please fill out both fields.');
    return;
  }

  const payload = {
    username: username,
    password: password
  };

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Registration submitted successfully!');
    } else {
      alert('Failed to submit registration.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred.');
  }
});

```

> 🔧 Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.

---

### 🟩 `data/users.json`

```json
[]
```

> This file will store your registered users. Leave it as an empty array initially.

---

### 🟦 `.github/workflows/update-users.yml`

```yaml
name: Update Users JSON

on:
  issues:
    types: [opened]  # Trigger action when an issue is created

jobs:
  update-users-json:
    runs-on: ubuntu-latest
    steps:
      # Checkout the repository code
      - name: Checkout code
        uses: actions/checkout@v2

      # Set up Node.js
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      # Install dependencies
      - name: Install dependencies
        run: npm install

      # Run the script to update the JSON file
      - name: Update users.json file
        run: node js/update-users.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Pass the secret to the script

      # Commit and push changes to GitHub
      - name: Commit changes
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git add data/users.json
          git commit -m "Update users.json with new registration"
          git push

```

---

### 🚀 How to Use

1. 🌐 Start your backend node server by typing `npm start`
2. ✅ Push all this to your GitHub repo.
3. ✅ Go to `https://YOUR_USERNAME.github.io/YOUR_REPO/` (GitHub Pages must be enabled).
4. 🔄 GitHub Action runs and updates `data/users.json`.

---

## 🎯 A basic **Node.js Express server** setup to securely interact with GitHub's API using your token. 

This way, your frontend can **send data to your backend**, and the backend will then make requests to GitHub API using the token securely.

### 🌐 Solution Overview:

1. **Frontend (GitHub Page)**:
   - The user fills out a form and submits it.
   - Instead of sending the GitHub API request directly from the frontend, it sends a **POST request** to your **backend server** with the form data.

2. **Backend (Node.js Server)**:
   - The backend receives the data from the frontend.
   - The backend uses the **Personal Access Token** (stored securely) to interact with GitHub's API and performs actions like creating issues or writing to a file.

---

### ⚙️ Step-by-Step: Implementing Secure Token Handling with Node.js

### 1. **Set Up Your Backend Server**

1. **Install Node.js & Dependencies**:

   First, ensure that **Node.js** is installed on your machine. If you don’t have it, download it from [here](https://nodejs.org/).

   Then, create a new project directory and run the following commands in your terminal:

   ```bash
   mkdir github-backend
   cd github-backend
   npm init -y
   npm install express body-parser axios dotenv
   ```

   - **express**: A web framework for Node.js to handle HTTP requests.
   - **body-parser**: Middleware to parse the incoming request bodies.
   - **axios**: HTTP client to make requests to the GitHub API.
   - **dotenv**: To securely store environment variables (like your GitHub token).

2. **Create Server Files**:

   - Create a file called `server.js` and another file called `.env` to securely store your token.

### 2. **Set Up `.env` File for Storing GitHub Token**

Create a file `.env` in your project root directory and add the following line to it:

```plaintext
GITHUB_TOKEN=your_personal_access_token
```

> **IMPORTANT**: Never commit your `.env` file to GitHub. Add `.env` to your `.gitignore` to prevent this from happening.

### 3. **Create the Server (`server.js`)**

In the `server.js` file, set up an Express server that listens for incoming requests, uses the GitHub API to add users, and sends responses back to the frontend.

```javascript
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// GitHub Personal Access Token stored securely in .env file
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// GitHub API endpoint for creating an issue
const GITHUB_API_URL = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/issues';

// Handle POST request to register user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Prepare the issue data for GitHub
    const issueData = {
      title: `New user registration: ${username}`,
      body: `Username: ${username}\nPassword: ${password}`,
      labels: ['registration', 'new-user']
    };

    // GitHub API request to create an issue
    const response = await axios.post(GITHUB_API_URL, issueData, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    // Send success response
    res.status(200).json({ message: 'User registration submitted successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### 4. **Explanation of the Backend**

- **Environment Variable**: The token is stored in `.env` and accessed using `process.env.GITHUB_TOKEN`. This keeps it hidden from the frontend.
- **POST /register**: This endpoint receives the form data (username and password) from the frontend. It then creates a new issue in your GitHub repository, using the `axios` library to make a request to GitHub's API.
- **GitHub API Request**: The backend sends an authenticated `POST` request to GitHub to create an issue. The token is passed securely via the `Authorization` header.

---

### 5. **Frontend (GitHub Page)**

The frontend will now **send a POST request** to your server (instead of GitHub) with the registration data.

Here’s how you modify your `main.js` file:

```javascript
document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please fill out both fields.');
    return;
  }

  const payload = {
    username: username,
    password: password
  };

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Registration submitted successfully!');
    } else {
      alert('Failed to submit registration.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred.');
  }
});
```

### 6. **Start Your Backend Server**

To run the backend server, navigate to your project folder in your terminal and run:

```bash
node server.js
```
or
```bash
npm start
```

The server will start and listen on `http://localhost:3000`.

---

## CORS (Cross-Origin Resource Sharing) Issue

### 1. **Check CORS**:
If your frontend is hosted on GitHub Pages and your backend is running on `localhost:3000`, you might be facing a CORS issue. CORS restricts requests from one origin (like GitHub Pages) to another origin (like your backend). 

To fix this, you need to allow CORS on your backend. Here's how you can enable CORS in your `server.js` file using the `cors` package.

#### Install `cors` Package:
If you haven’t installed the `cors` package yet, do so by running:

```bash
npm install cors
```

#### Update `server.js` to Use CORS:

In your `server.js`, add the following lines:

```javascript
const cors = require('cors'); // Add this line
app.use(cors()); // Add this line to allow cross-origin requests
```

### 2. **Check Backend Server**:
Ensure your backend server (`http://localhost:3000`) is still running when you try to make the request from your GitHub Page. If the backend server is down, you will get the "An error occurred" message.

You can check if the backend is running by visiting `http://localhost:3000` in your browser. It should not show any error.

### 3. **Verify the Backend URL**:
Make sure that the URL you're using in the fetch request matches the one your server is running on. If you're running the backend on `localhost:3000`, and the GitHub Page is served from another origin, make sure you're correctly referencing the server in your JavaScript:

```javascript
const response = await fetch('http://localhost:3000/register', { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```


---


## **Testing the Server with Postman (Optional)**:

If you're not using the frontend (GitHub Page) right now and just want to test if your backend is working properly, you can use **Postman**.

#### Steps to Test with Postman:

- **Open Postman** (or any similar API testing tool).
- Set the request method to **POST**.
- Enter the URL: `http://localhost:3000/register`.
- Under the **Body** tab, select **raw** and **JSON** from the dropdown menu.
- Enter the following JSON in the body:

  ```json
  {
    "username": "testUser",
    "password": "testPassword"
  }
  ```

- Click **Send**.

You should get a response:

```json
{
  "message": "User registration submitted successfully."
}
```

And on your GitHub repository, you should see a new issue created with the title **"New Registration: testUser"** and the body showing **username** and **password**.

---

## 🎯 Final Code and Project structure

### Full Project Directory Structure

```
auth-app-github/
│
├── .github/                    # GitHub Actions workflow folder
│   └── workflows/
│       └── update-users.yml    # GitHub Actions workflow
│
├── data/                        # Folder to store data (like users.json)
│   └── users.json              # Users data file
│
├── js/                          # JavaScript files for the frontend and backend scripts
│   ├── main.js                 # Frontend JavaScript for handling registration form
│   └── update-users.js         # Backend script to update users.json
│
├── package.json                # npm package manager file with dependencies
├── package-lock.json           # npm lock file for exact dependencies
├── index.html                  # Frontend HTML file for registration
└── server.js                   # Backend server for handling form submission (Express.js)
```

### 1. `index.html`

This is your frontend HTML page where users can register.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mini Auth App</title>
  <style>
    body { font-family: sans-serif; margin: 2em; }
    label, input { display: block; margin-bottom: 1em; }
    button { padding: 0.5em 1em; }
  </style>
</head>
<body>
  <h1>🧑‍💻 Register</h1>
  <form id="register-form">
    <label>
      Username:
      <input type="text" id="username" required />
    </label>
    <label>
      Password:
      <input type="password" id="password" required />
    </label>
    <button type="submit">Register</button>
  </form>

  <script src="js/main.js"></script>
</body>
</html>
```

### 2. `js/main.js`

This file handles the registration form submission, sending the user data to the backend for processing.

```javascript
document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please fill out both fields.');
    return;
  }

  const payload = { username: username, password: password };

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Registration submitted successfully!');
    } else {
      alert('Failed to submit registration.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred.');
  }
});
```

### 3. `js/update-users.js`

This script is used in GitHub Actions to update the `users.json` file after the user submits the registration form.

```javascript
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_URL = 'https://api.github.com/repos/your-username/your-repo/issues';

const usersFilePath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

const issueData = users.map(user => ({
  title: `New user registration: ${user.username}`,
  body: `Username: ${user.username}\nPassword: ${user.password}`,
  labels: ['registration', 'new-user']
}));

async function createGitHubIssue(issueData) {
  try {
    const response = await axios.post(GITHUB_API_URL, issueData, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    console.log('GitHub issue created:', response.data.html_url);
  } catch (error) {
    console.error('Error creating GitHub issue:', error);
  }
}

createGitHubIssue(issueData);
```

### 4. `package.json`

This file lists the dependencies, including `axios`, that you need for the backend server and the GitHub Actions.

```json
{
  "name": "auth-app-github",
  "version": "1.0.0",
  "description": "Mini Authentication App with GitHub Issues integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "axios": "^0.21.1",
    "express": "^4.17.1"
  }
}
```

### 5. `package-lock.json`

This file is automatically generated by npm when you run `npm install`. It locks the versions of your dependencies. You don't need to edit this file manually.

### 6. `server.js`

This is your backend Express server that handles the registration API.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint to handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Read the existing users from the JSON file
  const usersFilePath = path.join(__dirname, 'data', 'users.json');
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  // Add new user to the list
  users.push({ username, password });

  // Save updated users list to users.json
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(200).json({ message: 'User registered successfully!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

### 7. `.github/workflows/update-users.yml`

This is the GitHub Actions configuration that runs when a new issue is created. It updates the `users.json` file and pushes the changes back to GitHub.

```yaml
name: Update Users JSON

on:
  issues:
    types: [opened]  # Trigger action when an issue is created

jobs:
  update-users-json:
    runs-on: ubuntu-latest
    steps:
      # Checkout the repository code
      - name: Checkout code
        uses: actions/checkout@v2

      # Set up Node.js
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      # Install dependencies
      - name: Install dependencies
        run: npm install

      # Run the script to update the JSON file
      - name: Update users.json file
        run: node js/update-users.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Pass the secret to the script

      # Commit and push changes to GitHub
      - name: Commit changes
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git add data/users.json
          git commit -m "Update users.json with new registration"
          git push
```

### 8. `data/users.json`

This file will hold the registered user data in JSON format. Initially, it can be empty:

```json
[]
```

### Workflow Steps:

1. **Frontend Registration**: The user submits their username and password on the registration page (`index.html`). The data is sent via `POST` to the backend server (`server.js`).

2. **Backend Handling**: The backend receives the registration request, validates it, and appends the user data to `users.json`.

3. **GitHub Actions**: When a new issue is created on GitHub (via the backend or another trigger), GitHub Actions triggers the workflow. The `update-users.js` script reads the `users.json`, creates a GitHub issue for each user, and updates the `users.json` file.

4. **Push Updates**: GitHub Actions commits and pushes the updated `users.json` back to your repository.

This setup will ensure that your users' registrations are handled securely and efficiently using GitHub, with the user data stored in `users.json` and automatically updated using GitHub Actions.

---


## 🎯 Updated `update-users.js` to close the issue after it's created

```javascript
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
```

### Explanation of the Code:
1. **Fetch the Latest Issue**:
   - The script fetches the most recent issue using a `GET` request to the GitHub API.
   - The latest issue is assumed to be the registration issue for a user.

2. **Extract Username and Password**:
   - The username is extracted from the title (by removing the prefix `New user registration:`).
   - The password is extracted from the issue body using a regular expression.

3. **Update `users.json`**:
   - The script reads the current `users.json` file.
   - It adds the new user (with the extracted username and password) to the array of users.
   - The updated array is written back to the `users.json` file.

4. **Close the GitHub Issue**:
   - The issue number is retrieved from the issue response (`issue.number`).
   - A `PATCH` request is sent to the GitHub API to change the issue's state to `closed`.
   - The issue will be marked as closed after it's successfully updated.

### Important Considerations:
- **GitHub Token**: Ensure your GitHub token is securely stored (e.g., in environment variables or GitHub Secrets). Avoid hardcoding it directly in the script.
- **Error Handling**: The script handles any errors that may occur during either the update to `users.json` or closing the issue.

This setup will ensure that once a user registers (creating an issue), the issue is automatically closed after the user data is added to the `users.json` file.

---
