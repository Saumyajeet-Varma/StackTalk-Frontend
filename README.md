# StackTalk Frontend

**StackTalk** is a collaborative project management and real-time chat application with **AI-powered assistance**.  
This repository contains the **React.js + Vite + Tailwind CSS** frontend, designed to integrate seamlessly with the StackTalk backend.

## Features

- **User Authentication** – Register, login, and maintain secure sessions.
- **Project Room Management** – Create or join project-specific chat rooms.
- **Real-Time Messaging** – Powered by Socket.io for instant communication.
- **AI Integration** – Mention `@ai` in chat to interact with Gemini for code generation.
- **Responsive Design** – Works on desktop and mobile.
- **Code Editing & Highlighting** – Syntax highlighting via `prismjs` and inline code editing with `react-simple-code-editor`.
<!-- - **WebContainer Support** – Run and test code in-browser using `@webcontainer/api`. -->

## Tech Stack

**Frontend Framework:** React 18 (Vite)  
**Styling:** Tailwind CSS + PostCSS + Remix Icons  
**State Management:** React Context API  
**Routing:** React Router v7  
**Real-Time:** Socket.io Client  
**HTTP Client:** Axios  
**Code Editing:** React Simple Code Editor + PrismJS + Highlight.js  
**Markdown Rendering:** markdown-to-jsx  

## Project Structure

```md
Directory structure:
└── saumyajeet-varma-stacktalk-frontend/
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── auth/
        │   └── UserAuth.jsx
        ├── config/
        │   ├── axios.js
        │   ├── socket.js
        │   └── webContainer.js
        ├── context/
        │   └── user.context.jsx
        ├── pages/
        │   ├── Homepage.jsx
        │   ├── Login.jsx
        │   ├── Project.jsx
        │   └── Register.jsx
        └── routes/
            └── AppRoutes.jsx

```

## Installation & Setup

1. **Clone the repo**
```bash
git clone https://github.com/saumyajeet-varma/stacktalk-frontend.git
cd stacktalk-frontend

```

2. **Install dependencies**

```bash
npm install

```

3. **Set environment variables**

Create a `.env` file:

```env
VITE_BACKEND_URL = your_backend_url

```

4. **Start the dev server**

```bash
npm run dev

```

5. **Build for production**

```bash
npm run build

```

## Usage

- Login/Register to access features.
- Create or join a project room.
- Chat in real-time with your team.
- Use `@ai` in chat to request code generation.

## Contributing

- Fork the repo
- Create your feature branch (`git checkout -b feature-name`)
- Commit changes (`git commit -m 'Add some feature'`)
- Push to branch (`git push origin feature-name`)
- Open a Pull Request

## Related repositories

- **Backend**: [StackTalk Backend](https://github.com/Saumyajeet-Varma/StackTalk-Backend)

## Author

- **Saumyajeet Varma**: [GitHub](https://github.com/Saumyajeet-Varma)