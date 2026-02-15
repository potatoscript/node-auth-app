const API="https://node-auth-app.potatoscript-com.workers.dev";

// ===== REGISTER =====
document.getElementById("register-form").onsubmit=async e=>{
  e.preventDefault();

  await fetch(API+"/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username:username.value,
      password:password.value
    })
  });

  alert("Registered!");
  load();
};

// ===== LOGIN =====
document.getElementById("login-form").onsubmit=async e=>{
  e.preventDefault();

  const r=await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username:luser.value,
      password:lpass.value
    })
  });

  const d=await r.json();
  alert(d.success?"Login OK":"Login Fail");
};

// ===== LOAD USERS =====
async function load(){
  const r=await fetch(API+"/users");
  const data=await r.json();

  users.innerHTML="";

  data.forEach(u=>{
    users.innerHTML+=`
      <tr>
        <td>${u.username}</td>
        <td>
          <button class="action-btn"
            onclick="edit(${u.id},'${u.username}')">Edit</button>
          <button class="action-btn delete-btn"
            onclick="del(${u.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ===== DELETE =====
async function del(id){
  await fetch(API+"/delete/"+id);
  load();
}

// ===== EDIT =====
async function edit(id,name){
  const n=prompt("New username:",name);
  if(!n) return;

  await fetch(API+"/edit",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({id,username:n})
  });

  load();
}

load();