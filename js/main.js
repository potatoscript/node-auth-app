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
});
