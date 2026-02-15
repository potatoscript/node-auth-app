const API = "https://node-auth-app.potatoscript-com.workers.dev";

let currentRole = null;

// ===== REGISTER =====
document.getElementById("register-form")
.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  await fetch(`${API}/register`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  alert("Registered!");
  e.target.reset();
});

// ===== LOGIN =====
async function login(){
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const res = await fetch(`${API}/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  const data = await res.json();

  if(!data.success){
    alert("Login failed");
    return;
  }

  currentRole = data.role;
  alert("Login success as "+currentRole);

  if(currentRole==="admin")
    loadUsers();
}

// ===== LOAD USERS (ADMIN ONLY) =====
async function loadUsers(){
  if(currentRole!=="admin") return;

  const res = await fetch(`${API}/users`,{
    headers:{"x-role":"admin"}
  });

  const users = await res.json();

  const tbody = document.querySelector("#users-table tbody");
  tbody.innerHTML="";

  users.forEach(u=>{
    const row=document.createElement("tr");

    row.innerHTML=`
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td><button onclick="deleteUser(${u.id})">Delete</button></td>
    `;

    tbody.appendChild(row);
  });
}

// ===== DELETE =====
async function deleteUser(id){
  await fetch(`${API}/delete/${id}`,{
    method:"DELETE",
    headers:{"x-role":"admin"}
  });

  loadUsers();
}