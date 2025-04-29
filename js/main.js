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
        
        // Start polling to check if the new user appears
        const maxRetries = 12; // e.g., 12 tries * 5s = 60 seconds max
        const intervalMs = 5000; // 5 seconds
        let retries = 0;
      
        const usernameToFind = payload.username;
      
        const pollForUser = async () => {
          retries++;
      
          try {
            const response = await fetch('http://localhost:3000/users');
            const users = await response.json();
      
            const found = users.some(user => user.username === usernameToFind);
      
            if (found) {
              console.log('✅ New user found in users.json! Refreshing table...');
              await loadUsers();
              clearInterval(polling); // Stop polling
            } else {
              console.log(`⏳ New user not found yet... (retry ${retries}/${maxRetries})`);
              if (retries >= maxRetries) {
                clearInterval(polling);
                alert('New user not found after waiting. Please refresh manually later.');
              }
            }
          } catch (error) {
            console.error('Error polling users:', error);
            clearInterval(polling);
            alert('Error occurred during polling.');
          }
        };
      
        const polling = setInterval(pollForUser, intervalMs);
      
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
