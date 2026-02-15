document.addEventListener('DOMContentLoaded', () => {

  const API = "https://node-auth-app.potatoscript-com.workers.dev";

  const form = document.getElementById('register-form');

  // =========================
  // REGISTER
  // =========================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Please fill out both fields.');
      return;
    }

    const payload = { username, password };

    try {
      const response = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        alert('Registration failed.');
        return;
      }

      alert('Registration successful!');
      form.reset();

      startPollingForNewUser(username);

    } catch (err) {
      console.error(err);
      alert('Network error.');
    }
  });

  // =========================
  // POLLING AFTER REGISTER
  // =========================
  function startPollingForNewUser(usernameToFind) {

    const maxRetries = 12;
    const intervalMs = 5000;
    let retries = 0;

    const polling = setInterval(async () => {
      retries++;

      try {
        const res = await fetch(`${API}/users`);
        const users = await res.json();

        const found = users.some(u => u.username === usernameToFind);

        if (found) {
          console.log("✅ User found, refreshing table");
          loadUsers();
          clearInterval(polling);
        }

        if (retries >= maxRetries) {
          clearInterval(polling);
          alert("User not found yet. Try refreshing later.");
        }

      } catch (err) {
        console.error(err);
        clearInterval(polling);
      }

    }, intervalMs);
  }

  // =========================
  // LOAD USERS TABLE
  // =========================
  async function loadUsers() {
    try {
      const response = await fetch(`${API}/users`);
      const users = await response.json();

      const tableBody = document.querySelector('#users-table tbody');
      tableBody.innerHTML = '';

      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.password}</td>
        `;
        tableBody.appendChild(row);
      });

    } catch (err) {
      console.error(err);
      alert('Failed to load users.');
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  loadUsers();

});