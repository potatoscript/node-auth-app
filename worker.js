export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS")
      return new Response("", { headers: cors() });

    try {

      // ===== REGISTER =====
      if (url.pathname === "/register" && req.method === "POST") {
        let { username, password } = await req.json();

        // Normalize input
        username = username.trim().toLowerCase();
        password = password.trim();

        const hashed = await hash(password);

        await env.DB.prepare(
          "INSERT INTO users (username,password,role) VALUES (?,?,?)"
        ).bind(username, hashed, "user").run();

        return json({ success:true });
      }

      // ===== LOGIN =====
      if (url.pathname === "/login" && req.method === "POST") {
        let { username,password } = await req.json();

        username = username.trim().toLowerCase();
        password = password.trim();

        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE username=?"
        ).bind(username).first();

        if (!user)
          return json({ success:false });

        const ok = await verify(password,user.password);

        if (!ok)
          return json({ success:false });

        return json({
          success:true,
          role:user.role || "user"
        });
      }

      // ===== USERS (ADMIN ONLY) =====
      if (url.pathname === "/users") {
        const role = req.headers.get("x-role");

        if (role !== "admin")
          return json({ error:"Unauthorized" });

        const { results } = await env.DB
          .prepare("SELECT id,username,role FROM users")
          .all();

        return json(results);
      }

      // ===== DELETE (ADMIN ONLY) =====
      if (url.pathname.startsWith("/delete/")) {
        const role = req.headers.get("x-role");

        if (role !== "admin")
          return json({ error:"Unauthorized" });

        const id = url.pathname.split("/")[2];

        await env.DB.prepare(
          "DELETE FROM users WHERE id=?"
        ).bind(id).run();

        return json({ success:true });
      }

      return new Response("Not found",{status:404});

    } catch(e){
      return json({ error:e.toString() });
    }
  }
};

// ===== Helpers =====

function cors(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"Content-Type,x-role",
    "Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS"
  };
}

function json(data){
  return new Response(JSON.stringify(data),{
    headers:{...cors(),"Content-Type":"application/json"}
  });
}

async function hash(str){
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );

  return Array.from(new Uint8Array(buf))
    .map(b=>b.toString(16).padStart(2,"0"))
    .join("");
}

async function verify(input,stored){
  return (await hash(input)) === stored;
}