document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', async function (e) {
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
        form.reset();
        await loadUsers(); // Refresh user table after successful registration
      } else {
        alert('Failed to submit registration.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  });

  async function loadUsers() {
    try {
      const response = await fetch('users.json'); // assuming users.json is available publicly
      if (!response.ok) throw new Error('Could not fetch users.json');

      const users = await response.json();
      const tbody = document.getElementById('users-table').querySelector('tbody');
      tbody.innerHTML = '';

      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${user.username}</td><td>${user.password}</td>`;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  // Load users immediately when page loads
  loadUsers();
});
