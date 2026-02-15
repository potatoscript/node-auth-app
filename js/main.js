// ===== CONFIG =====
const API = "https://node-auth-app.potatoscript-com.workers.dev"; 
// 👆 replace if your worker URL is different


// ===== REGISTER =====
document.getElementById("register-form")
.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Registered!");
      e.target.reset();
      loadUsers(); // auto refresh table
    } else {
      alert("❌ Failed");
    }

  } catch(err){
    alert("Server error");
    console.error(err);
  }
});


// ===== LOAD USERS =====
async function loadUsers(){
  try{
    const res = await fetch(`${API}/users`);
    const users = await res.json();

    const tbody = document.querySelector("#users-table tbody");
    tbody.innerHTML = "";

    if (!users.length){
      tbody.innerHTML = `<tr><td colspan="3" class="empty">No users yet</td></tr>`;
      return;
    }

    users.forEach(u=>{
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td class="actions">
          <button onclick="deleteUser(${u.id})">Delete</button>
        </td>
      `;

      tbody.appendChild(row);
    });

  } catch(err){
    console.error(err);
    alert("Failed loading users");
  }
}


// ===== DELETE USER =====
async function deleteUser(id){
  if (!confirm("Delete this user?")) return;

  await fetch(`${API}/delete/${id}`,{
    method:"DELETE"
  });

  loadUsers();
}


// ===== INITIAL LOAD =====
loadUsers();