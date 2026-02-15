# 🧑‍💻 Node Auth App (Cloudflare Edition)

This project is a **serverless authentication app** designed for learning and prototyping.

Users can:

- Register accounts  
- Login securely  
- Store hashed passwords  
- Separate admin vs normal users  
- Allow admin-only user management  

This project demonstrates how to build a simple login/register system without running a traditional server, using:

✅ Cloudflare Workers (backend API)  
✅ Cloudflare D1 (database)  
✅ Cloudflare Pages (frontend hosting)  
✅ Vanilla HTML/CSS/JS frontend  
✅ SHA-256 password hashing  

---

# 🏗 Architecture

```

Frontend (Cloudflare Pages)
↓ fetch()
Cloudflare Worker API
↓
Cloudflare D1 Database (SQLite)

````

---

# 📁 Project Structure

```text
node-auth-app/
│
├── worker.js           # Backend API (Cloudflare Worker)
├── wrangler.toml       # Worker configuration
│
├── public/
│   ├── index.html      # UI
│   ├── css/style.css   # Styling
│   └── js/main.js      # Frontend logic
│
└── README.md
````

---

# 🚀 Features

## 👤 User Features

* Register account
* Login securely
* Password hashing (SHA-256)
* Clean UI

## 🔑 Admin Features

* View all users
* Delete users
* Admin-only access control

---

# ⚙️ Step-by-Step Setup

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/node-auth-app.git
cd node-auth-app
```

---

## 2️⃣ Install Wrangler

```bash
npm install -g wrangler
```

Login:

```bash
wrangler login
```

---

## 3️⃣ Create D1 Database

```bash
wrangler d1 create node-auth-db
```

Copy the database ID into `wrangler.toml`.

---

## 4️⃣ Create Users Table

```bash
wrangler d1 execute node-auth-db --command "
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT
);
"
```

---

## 5️⃣ Add Admin User

Admin password = **1234**

```bash
wrangler d1 execute node-auth-db --command "
INSERT INTO users (username,password,role)
VALUES (
  'admin',
  '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
  'admin'
);
"
```

---

## 6️⃣ Deploy Worker (Backend)

```bash
wrangler deploy
```

You’ll get:

```
https://your-worker.workers.dev
```

---

## 7️⃣ Deploy Frontend

Push repo to GitHub and connect to Cloudflare Pages:

Settings:

```
Build command: (none)
Output directory: /public
```

Deploy.

You’ll get:

```
https://your-site.pages.dev
```

---

## 8️⃣ Connect Frontend to Backend

In `main.js`, set:

```javascript
const API = "https://your-worker.workers.dev";
```

---

# 🔐 Security Notes

✅ Passwords are hashed
❌ No JWT/session yet (learning project)
❌ Admin auth uses header role check

For production:

* Add JWT authentication
* Add rate limiting
* Use HTTPS-only cookies

---

# 🎓 Learning Goals

This project teaches:

* Serverless backend design
* Edge computing basics
* REST API building
* Auth system design
* Database integration
* Role-based access control

---

# 📌 Future Improvements

* JWT login sessions
* Password salting
* Email verification
* UI framework (React/Vue)
* OAuth login

---

# 🙌 Credits

Built using:

* Cloudflare Workers
* Cloudflare D1
* Cloudflare Pages

---

