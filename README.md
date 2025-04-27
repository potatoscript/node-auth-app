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


