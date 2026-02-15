const API = "https://node-auth-app.potatoscript-com.workers.dev";

let currentRole=null;

// ===== REGISTER =====
document.getElementById("register-form")
.addEventListener("submit",async e=>{
  e.preventDefault();

  const username=document.getElementById("reg-username").value.trim();
  const password=document.getElementById("reg-password").value.trim();

  const res=await fetch(`${API}/register`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  const data=await res.json();

  if(data.success){
    alert("Registered!");
    e.target.reset();
  }else{
    alert("Failed");
  }
});

// ===== LOGIN =====
async function login(){
  const username=document.getElementById("login-username").value.trim();
  const password=document.getElementById("login-password").value.trim();

  const res=await fetch(`${API}/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  const data=await res.json();

  if(!data.success){
    alert("Login failed");
    return;
  }

  currentRole=data.role;

  alert("Logged in as "+currentRole);

  if(currentRole==="admin"){
    document.getElementById("users-table").style.display="table";
    loadUsers();
  }
}

// ===== LOAD USERS (ADMIN) =====
async function loadUsers(){
  const res=await fetch(`${API}/users`,{
    headers:{"x-role":"admin"}
  });

  const users=await res.json();

  const tbody=document.querySelector("#users-table tbody");
  tbody.innerHTML="";

  users.forEach(u=>{
    const row=document.createElement("tr");
    row.innerHTML=`
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td class="actions">
        <button onclick="deleteUser(${u.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===== DELETE =====
async function deleteUser(id){
  if(!confirm("Delete user?")) return;

  await fetch(`${API}/delete/${id}`,{
    method:"DELETE",
    headers:{"x-role":"admin"}
  });

  loadUsers();
}