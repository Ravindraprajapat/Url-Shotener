
# 🚀 URL Shortener

A simple **URL Shortener** built with **Node.js (http module)** and vanilla **HTML, CSS, JS**.  
It allows you to shorten long URLs into small codes and manage them easily.

---

## 📂 Project Structure

project/
├── app.js # Backend server (Node.js)
├── data/
│ └── links.json # Stores shortened URLs
├── public/
│ ├── index.html # Frontend (UI)
│ └── style.css # Styling

## ✨ Features
- Shorten any long URL into a short code.
- Provide your own custom short code (optional).
- Redirect to original URL using the short code.
- View all shortened URLs.
- Data stored in local JSON file (`data/links.json`)

🎨 Frontend UI

A simple HTML form to enter URL & custom short code.

Dynamic list of all shortened URLs.

Clickable links open in a new tab.

🛠 Tech Stack

Backend: Node.js (http, fs, path, crypto, chalk)

Frontend: HTML, CSS, Vanilla JavaScript

Database: JSON file (data/links.json)
