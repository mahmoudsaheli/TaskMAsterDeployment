# TaskMaster — Your Personal Task Manager

Welcome to **TaskMaster**, a clean and professional online task directory built with Express and Handlebars (HBS). This app helps users easily manage their tasks with a smooth, user-friendly experience.

---

## Features & Highlights

### Project Setup
- Built with **Express Generator** using the **HBS templating engine**.
- Stylish design crafted with **Bootstrap** and custom CSS for a polished, unique look.
- Professional site layout with a **shared header and footer** for easy navigation.
- Home page serves as a welcoming splash page to introduce users to TaskMaster.

### Authentication
- Public page showing a **read-only list** of tasks from the database.
- User registration and login pages, including **GitHub OAuth login**.
- Secure authentication powered by **passport-local** and **passport-github** strategies.

### CRUD Functionality
- MongoDB database hosted on **MongoDB Atlas**, with credentials securely stored in environment variables.
- Authenticated users can **view, add, edit, and delete tasks**.
- Delete confirmation dialogs to prevent accidental removals.

### Additional Feature
- Implemented **Keyword Search** on the public tasks page, allowing users to easily find tasks by title or description.
- This feature demonstrates independent learning by integrating MongoDB’s full-text search capabilities.

---

## How to Use

1. Visit the home page and browse public tasks without logging in.
2. Register or log in using your credentials or GitHub account.
3. Once logged in, access your personal dashboard to manage your tasks.
4. Use the search bar to quickly find tasks on the public page.

Thanks for checking out TaskMaster! Feel free to explore the code, suggest improvements, or contribute.
