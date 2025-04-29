## 🎯 **Complete working minimal authentication app** using:
<table>
  <tr>
    <td align="left" width="50%">
      - ✅ A simple HTML form  <br><br>
      - ✅ GitHub Issues to "register" a user <br><br>  
      - ✅ GitHub Actions to write that user into `data/users.json` <br><br>  
      - ✅ With node express server as local backend<br><br><br><br>
    </td>
    <td align="left" width="50%">
      <img src="https://github.com/potatoscript/MyDocuments/blob/main/node-auth-app.png?raw=true" width="450" />
    </td>
  </tr>
</table>

# 🚀 **Project Menu**   

| Title |
|------------------------------------------------|
| [🗂 Folder Structure](https://github.com/potatoscript/node-auth-app/wiki/Folder-Structure) |


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

## Next Steps: To include a table for displaying the user data.

### Updated HTML (index.html):

Add a `<table>` where the user data will be displayed:

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
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ccc;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
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

  <h2>Registered Users</h2>
  <table id="users-table">
    <thead>
      <tr>
        <th>Username</th>
        <th>Password</th>
      </tr>
    </thead>
    <tbody>
      <!-- User data will be populated here -->
    </tbody>
  </table>

  <script src="js/main.js"></script>
</body>
</html>
```

### Updated JavaScript (main.js):

Modify the JavaScript to fetch the users' data from the backend and populate the table:

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
      loadUsers();  // Reload the table with updated users
    } else {
      alert('Failed to submit registration.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred.');
  }
});

// Function to load users and display them in the table
async function loadUsers() {
  try {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';  // Clear the existing table rows

    // Populate the table with user data
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.password}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    alert('Failed to load user data.');
  }
}

// Load users when the page is first loaded
window.onload = loadUsers;
```

### Explanation of Changes:
1. **HTML**: Added a `<table>` to display the user data. The table will automatically update with the data when the page loads.
2. **JavaScript**:
   - **`loadUsers` function**: Fetches the user data from your backend (`/users` route) and populates the table with the fetched data.
   - **Table Update**: When the registration form is submitted, it triggers the `loadUsers()` function to refresh the table with the latest data.
   - **`window.onload`**: Ensures the table is populated as soon as the page is loaded.

### How It Works:
- When the page loads, the `loadUsers` function is called, which fetches the user data from your backend and populates the table.
- When a new user is registered, the table is updated to reflect the new data.

### Testing:
1. Ensure your backend is running.
2. Open your browser and reload the page.
3. You should now see the list of registered users displayed in the table.


