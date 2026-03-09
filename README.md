# 🃏 Planning Poker App

A fully local, browser-based Planning Poker / Scrum Poker app for team estimation sessions. No subscription, no backend required - runs entirely in your browser or on your local network.

## ✨ Features

- **Real-Time Voting**: See votes cast in real-time with Socket.io
- **Multiple Deck Types**: Fibonacci, Modified Fibonacci, T-Shirt Sizes, Powers of 2, or Custom
- **Issue Management**: Add, import (CSV), and export issues
- **Smart Analytics**: Visual charts, consensus indicators, and vote distribution
- **Spectator Mode**: Allow team members to observe without voting
- **Auto-Reveal**: Automatically reveal votes when all players have voted
- **Beautiful UI**: Card-like aesthetics with smooth animations
- **Session Persistence**: localStorage keeps your game state across refreshes
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Quick Start
## 🌐 Deploy to Internet (FREE)

Want to share with your team over the internet? Deploy for **FREE** using:
- **Backend**: Render.com (FREE tier)
- **Frontend**: Vercel or Netlify (FREE tier)

📖 **[See Complete Deployment Guide →](./DEPLOYMENT.md)**

⚡ **[Quick Start Guide →](./FREE_DEPLOYMENT.md)**

**Total Cost: $0/month** - No credit card required!

---

## 🏠 Run Locally


### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npm run dev
   ```

   This will start both the Socket.io server (port 3001) and the Vite dev server (port 5173).

3. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📖 How to Use

### Creating a Game (Host)

1. Click **"Start New Game"** on the landing page
2. Enter your name
3. Configure game settings:
   - **Game Name** (optional)
   - **Card Deck**: Choose from preset decks or create custom values
   - **Allow Spectators**: Let observers join without voting
   - **Auto-reveal**: Automatically show votes when all players vote
4. Click **"Create Game"**
5. Share the room link with your team

### Joining a Game (Player)

1. Click **"Join Existing Game"** or use the shared room link
2. Enter your name
3. Optionally join as a spectator
4. Click **"Join Game"**

### Playing a Round

**As Host:**
1. Add issues using the sidebar (or import from CSV)
2. Click an issue to start voting
3. Click **"Reveal Votes"** when ready (or wait for auto-reveal)
4. Review results in the right panel
5. Set the final estimate
6. Click **"New Round"** to vote again or **"Next Issue"** to move on

**As Player:**
1. Wait for the host to start voting
2. Click a card to cast your vote
3. You can change your vote before reveal
4. View results after reveal

## 🏗️ Project Structure

```
planning-poker/
├── server/
│   └── server.js           # Socket.io server
├── src/
│   ├── components/
│   │   ├── Card.jsx        # Playing card component
│   │   ├── IssueSidebar.jsx   # Issue queue management
│   │   ├── PlayerList.jsx     # Player avatars and status
│   │   ├── ResultsPanel.jsx   # Vote results and charts
│   │   └── VotingArea.jsx     # Main voting interface
│   ├── pages/
│   │   ├── LandingPage.jsx    # Home page
│   │   ├── NewGame.jsx        # Game creation form
│   │   ├── Join.jsx           # Join game page
│   │   └── Room.jsx           # Main game room
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Real-Time**: Socket.io (server + client)
- **Charts**: Recharts
- **Routing**: React Router v6
- **Server**: Express + Node.js

## 📊 CSV Import/Export

### Import Issues
Format your CSV file with columns: `title,description`

Example:
```csv
title,description
User login page,As a user I want to log in
Dashboard UI,Create responsive dashboard
API integration,Connect to backend API
```

### Export Results
Exports all issues with their estimates and status to CSV format.

## 🎮 Keyboard Shortcuts

- **Host Controls** are accessible via buttons in the UI
- **Click cards** to vote (no keyboard shortcuts for voting to maintain card game feel)

## 🔧 Configuration

### Changing Ports

**Server Port** (default 3001):
Edit `server/server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

**Client Port** (default 5173):
Edit `vite.config.js`:
```javascript
server: {
  port: 5173,
}
```

### Custom Deck Presets

Edit `src/pages/NewGame.jsx` to add more deck presets:
```javascript
const DECK_PRESETS = {
  myDeck: {
    name: 'My Custom Deck',
    values: ['1', '2', '3', '5', '8']
  }
};
```

## 🌐 Network Play

To play with team members on your local network:

1. Find your local IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: `ifconfig` or `ip addr`

2. Update client to connect to your IP:
   Edit `src/pages/Room.jsx`:
   ```javascript
   const newSocket = io('http://YOUR_IP:3001');
   ```

3. Share the room URL with your IP:
   ```
   http://YOUR_IP:5173/join/ROOM_ID
   ```

## 🐛 Troubleshooting

### "Cannot connect to server"
- Ensure the server is running on port 3001
- Check that no firewall is blocking the connection
- Verify CORS settings in `server/server.js`

### "Room not found"
- The room may have been cleaned up (happens when all players leave)
- Create a new game

### Cards not appearing
- Check browser console for errors
- Ensure all dependencies are installed
- Try clearing localStorage: `localStorage.clear()`

## 📝 License

MIT License - feel free to use this for your team!

## 🤝 Contributing

This is a self-contained app, but feel free to fork and customize for your needs!

## 📧 Support

For issues or questions, create an issue in the repository.

---

**Enjoy your Planning Poker sessions! 🎉**
