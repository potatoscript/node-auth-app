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
