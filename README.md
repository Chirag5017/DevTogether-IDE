# 🖥️ DevTogether IDE

A collaborative, web-based code editor with built-in terminal functionality inspired by modern development environments like VS Code.

## 📋 Overview

DevTogether IDE is a full-featured development environment that runs in your browser. It provides a familiar interface with file management, code editing, and terminal capabilities - all synced in real-time for collaborative coding.

## ✨ Features

- **📁 File Explorer**: Browse, create, and manage files and folders
- **📝 Code Editor**: Syntax highlighting and code editing with Monaco Editor
- **💻 Terminal Integration**: Built-in terminal with full shell access
- **🔄 Real-time Collaboration**: Changes sync automatically between users
- **📊 Responsive UI**: Resizable panels for customized workspace
- **🌙 Dark Theme**: Eye-friendly dark interface for comfortable coding

## 🏗️ Architecture

### 🎨 Frontend

- **⚛️ React**: UI framework for building the interface
- **🔌 Socket.io-client**: Real-time communication with the server
- **🧠 Monaco Editor**: VS Code editor component
- **🖲️ Xterm.js**: Terminal emulator

### 🖧 Backend

- **🚂 Express**: Web server framework
- **🔄 Socket.io**: Real-time bidirectional communication
- **🧩 node-pty-prebuilt-multiarch**: Terminal process spawning
- **👀 chokidar**: File system watcher for change detection

## 📁 Project Structure

```
├── Frontend
│   ├── App.jsx              # Main application component
│   ├── components
│   │   ├── Editor.jsx       # Monaco editor component
│   │   ├── FileTree.jsx     # File explorer component
│   │   └── Terminal.jsx     # Terminal component
│   ├── socket.js            # Socket.io client configuration
│   └── utils
│       └── getFileExtension.js  # Utility for file extension detection
│
├── Backend
│   ├── index.js             # Entry point for the application
│   ├── app.js               # Express and Socket.io server setup
│   ├── routes
│   │   └── ide.routes.js    # API endpoints for file operations
│   └── controllers
│       └── generateFileTree.controller.js  # File tree generator
│
└── user                     # Working directory for user files
```

## ⚙️ How It Works

1. **📁 File Management**:
   - Files and folders are stored in the server's `./user` directory
   - The file system is watched for changes using chokidar
   - File tree is dynamically generated and sent to clients

2. **📝 Code Editing**:
   - Monaco Editor provides IDE-like editing experience
   - Changes are saved automatically after 1 second of inactivity
   - File content updates are sent via Socket.io

3. **💻 Terminal**:
   - A real shell instance is spawned using node-pty
   - Terminal I/O is streamed via Socket.io
   - Commands execute in the context of the user's workspace

4. **🔄 Real-time Updates**:
   - File changes trigger refresh events to all connected clients
   - Terminal output is broadcasted to all connected sessions

## 📸 Screenshots

Here are some screenshots of DevTogether IDE in action:

### Main Interface
![image](https://github.com/user-attachments/assets/487d0ed2-c400-459e-ade7-80b962b41d89)
*The full DevTogether IDE interface showing the file explorer, editor, and terminal*

### Code Editing
![image](https://github.com/user-attachments/assets/9bcbdea0-d748-47a1-87a8-8ce4c705f6c7)

*Editing JavaScript code with syntax highlighting and autocompletion*

### Terminal Usage
![image](https://github.com/user-attachments/assets/1c48d1ca-1f0e-4779-b373-86026c141c9c)

*Using the integrated terminal to run commands directly in the project context*

<!-- ### Collaborative Editing
![Real-time Collaboration](/api/placeholder/800/450)
*Multiple users working on the same file simultaneously* -->

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   https://github.com/Chirag5017/DevTogether-IDE.git
   cd DevTogether-IDE
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173 (or your configured port)
   ```

### Backend Installation

1. Navigate to the backend directory:
   ```
   cd Backend
   ```

2. Install backend dependencies:
   ```
   npm install
   ```
   ```

3. Start the backend server:
   ```
   npm run start
   ```

4. Ensure both frontend and backend are running for full functionality.

## 📖 Usage

1. **📁 Managing Files**:
   - Create new files or folders using the buttons in the explorer header
   - Select files to edit them in the code editor
   - Changes are automatically saved

2. **💻 Using the Terminal**:
   - Execute shell commands directly in the integrated terminal
   - The terminal runs in the context of your project

3. **🔧 UI Customization**:
   - Drag the dividers to resize the sidebar and terminal panels
   - Adjust to your preferred layout

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.