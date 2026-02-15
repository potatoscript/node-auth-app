export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response("", { headers: cors() });
    }

    try {

      // ========= REGISTER =========
      if (url.pathname === "/register" && req.method === "POST") {
        const { username, password } = await req.json();

        const hashed = await hash(password);

        await env.DB.prepare(
          "INSERT INTO users (username, password) VALUES (?, ?)"
        ).bind(username, hashed).run();

        return json({ success: true });
      }

      // ========= LOGIN =========
      if (url.pathname === "/login" && req.method === "POST") {
        const { username, password } = await req.json();

        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE username=?"
        ).bind(username).first();

        if (!user) return json({ success:false });

        const ok = await verify(password, user.password);

        return json({ success: ok });
      }

      // ========= GET USERS =========
      if (url.pathname === "/users") {
        const { results } = await env.DB.prepare(
          "SELECT id, username FROM users"
        ).all();

        return json(results);
      }

      // ========= DELETE =========
      if (url.pathname.startsWith("/delete/")) {
        const id = url.pathname.split("/")[2];

        await env.DB.prepare(
          "DELETE FROM users WHERE id=?"
        ).bind(id).run();

        return json({ success:true });
      }

      // ========= EDIT =========
      if (url.pathname === "/edit" && req.method==="POST") {
        const { id, username } = await req.json();

        await env.DB.prepare(
          "UPDATE users SET username=? WHERE id=?"
        ).bind(username,id).run();

        return json({ success:true });
      }

      return new Response("Not found", { status:404 });

    } catch(e) {
      return json({ error:e.toString() });
    }
  }
};

// ===== Helpers =====

function cors(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"Content-Type",
    "Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS"
  };
}

function json(data){
  return new Response(JSON.stringify(data),{
    headers:{...cors(),"Content-Type":"application/json"}
  });
}

// ===== Hashing =====

async function hash(str){
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

async function verify(input,stored){
  return (await hash(input))===stored;
}