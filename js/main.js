const API="https://node-auth-app.potatoscript-com.workers.dev";

let role=null;

// ===== VIEW SWITCH =====
function showRegister(){
  loginView.style.display="none";
  registerView.style.display="block";
}

function showLogin(){
  registerView.style.display="none";
  loginView.style.display="block";
}

// ===== REGISTER =====
async function register(){
  const username=regUser.value.trim();
  const password=regPass.value.trim();

  const res=await fetch(`${API}/register`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  const d=await res.json();

  if(d.success){
    alert("Account created!");
    showLogin();
  }else{
    alert("Failed");
  }
}

// ===== LOGIN =====
async function login(){
  const username=loginUser.value.trim();
  const password=loginPass.value.trim();

  const res=await fetch(`${API}/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username,password})
  });

  const d=await res.json();

  if(!d.success){
    alert("Login failed");
    return;
  }

  role=d.role;

  alert("Welcome "+role);

  if(role==="admin"){
    usersTable.style.display="table";
    loadUsers();
  }
}

// ===== LOAD USERS =====
async function loadUsers(){
  const res=await fetch(`${API}/users`,{
    headers:{"x-role":"admin"}
  });

  const users=await res.json();

  const tb=usersTable.querySelector("tbody");
  tb.innerHTML="";

  users.forEach(u=>{
    const r=document.createElement("tr");
    r.innerHTML=`
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td><button onclick="del(${u.id})">Delete</button></td>
    `;
    tb.appendChild(r);
  });
}

// ===== DELETE =====
async function del(id){
  await fetch(`${API}/delete/${id}`,{
    method:"DELETE",
    headers:{"x-role":"admin"}
  });
  loadUsers();
}