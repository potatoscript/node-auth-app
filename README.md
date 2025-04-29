## 🎯 **Complete working minimal authentication app** using:
<table>
  <tr>
    <td align="left" width="50%">
      - ✅ A simple HTML form  <br><br>
      - ✅ GitHub Issues to "register" a user <br><br>  
      - ✅ GitHub Actions to write that user into `data/users.json` <br><br>  
      - ✅ With node express server as local backend<br><br><br><br>
    </td>
    <td align="left" width="50%">
      <img src="https://github.com/potatoscript/MyDocuments/blob/main/node-auth-app.png?raw=true" width="450" />
    </td>
  </tr>
</table>

# 🚀 **Project Menu**   

| Title |
|------------------------------------------------|
| [🗂 Folder Structure](https://github.com/potatoscript/node-auth-app/wiki/Folder-Structure) |
| [🗂 Load User Data](https://github.com/potatoscript/node-auth-app/wiki/Load-User-Data) |

### 🚀 How to Use

1. 🌐 Start your backend node server by typing `npm start`
2. ✅ Push all this to your GitHub repo.
3. ✅ Go to `https://YOUR_USERNAME.github.io/YOUR_REPO/` (GitHub Pages must be enabled).
4. 🔄 GitHub Action runs and updates `data/users.json`.

---

## 🎯 A basic **Node.js Express server** setup to securely interact with GitHub's API using your token. 

This way, your frontend can **send data to your backend**, and the backend will then make requests to GitHub API using the token securely.

### 🌐 Solution Overview:

1. **Frontend (GitHub Page)**:
   - The user fills out a form and submits it.
   - Instead of sending the GitHub API request directly from the frontend, it sends a **POST request** to your **backend server** with the form data.

2. **Backend (Node.js Server)**:
   - The backend receives the data from the frontend.
   - The backend uses the **Personal Access Token** (stored securely) to interact with GitHub's API and performs actions like creating issues or writing to a file.

---


