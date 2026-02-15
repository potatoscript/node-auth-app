export default {
  async fetch(request) {
    const url = new URL(request.url);

    // LOGIN API
    if (url.pathname === "/api/login" && request.method === "POST") {
      const body = await request.json();

      const { username, password } = body;

      if (username === "admin" && password === "1234") {
        return new Response(JSON.stringify({
          success: true,
          message: "Login OK"
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        message: "Invalid"
      }), { status: 401 });
    }

    return new Response("Not Found", { status: 404 });
  }
};