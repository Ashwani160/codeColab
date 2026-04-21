# CodeColab

A real-time collaborative code editor where multiple users can write, edit, and run code together in the same room — like VS Code Live Share but browser-based.

## Features

- Create or join a room instantly with just a username and room ID
- Real-time code sync across all users in the same room
- Supports JavaScript, Python, C++, Java, and TypeScript
- Run code and see output live for everyone in the room
- Live user presence — see who's in the room
- Room chat
- Code persists when everyone leaves — rejoin and pick up where you left off
- Language changes sync across all users

## Tech Stack

**Frontend** — React, Vite, Tailwind CSS, shadcn/ui, Monaco Editor, Socket.io client

**Backend** — Node.js, Express, Socket.io, MongoDB Atlas, Mongoose

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)
- OneCompiler API key

### Setup

1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/codesync.git
cd codeColab
```

2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

3. Create `server/.env`