// ✅ ADD CORS OBJECT AT TOP
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // ✅ HANDLE PREFLIGHT (MUST BE FIRST)
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // ======================
    // REGISTER
    // ======================
    if (url.pathname === "/register" && req.method === "POST") {
      const { username, password } = await req.json();

      try {
        await env.DB
          .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
          .bind(username, password)
          .run();

        // ✅ ADD CORS HERE
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        });

      } catch {
        return new Response(JSON.stringify({ error: "User exists" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        });
      }
    }

    // ======================
    // GET USERS
    // ======================
    if (url.pathname === "/users") {
      const { results } = await env.DB
        .prepare("SELECT username, password FROM users")
        .all();

      // ✅ ADD CORS HERE
      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          ...cors
        }
      });
    }

    // ======================
    // NOT FOUND
    // ======================
    return new Response("Not found", {
      status: 404,
      headers: cors // ✅ ALSO HERE
    });
  }
};