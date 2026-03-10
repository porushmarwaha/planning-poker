import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import IssueSidebar from '../components/IssueSidebar';
import VotingArea from '../components/VotingArea';
import ResultsPanel from '../components/ResultsPanel';
import PlayerList from '../components/PlayerList';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  useEffect(() => {
    const gameData = JSON.parse(localStorage.getItem('currentGame') || '{}');
    const resolvedRoomId = gameData.roomId || roomId;
    
    if (!gameData.playerName) {
      navigate(`/join/${roomId}`);
      return;
    }

    // Connect to Socket.io server
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    const emitCreateRoom = () => {
      const roomSnapshot = JSON.parse(localStorage.getItem(`room_${resolvedRoomId}`) || 'null');
      newSocket.emit('create-room', {
        roomId: resolvedRoomId,
        roomName: gameData.gameName,
        deck: gameData.deck,
        allowSpectators: gameData.allowSpectators,
        autoReveal: gameData.autoReveal,
        roomSnapshot
      });
    };

    newSocket.on('connect', () => {
      if (gameData.isHost) {
        // Host reconnects to existing room first; create only if missing
        newSocket.emit('join-room', {
          roomId: resolvedRoomId,
          playerName: gameData.playerName,
          isSpectator: false
        });
      } else {
        // Join existing room
        newSocket.emit('join-room', {
          roomId,
          playerName: gameData.playerName,
          isSpectator: gameData.isSpectator
        });
      }
    });

    newSocket.on('room-update', (updatedRoom) => {
      setRoom(updatedRoom);
      // Save to localStorage
      localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedRoom));
    });

    newSocket.on('joined-room', (joinedRoom) => {
      setRoom(joinedRoom);
      const player = joinedRoom.players.find(p => p.id === newSocket.id);
      setCurrentPlayer(player);
    });

    newSocket.on('room-created', () => {
      // Host joins their own room after creation
      newSocket.emit('join-room', {
        roomId: resolvedRoomId,
        playerName: gameData.playerName,
        isSpectator: false
      });
    });

    newSocket.on('room-error', (error) => {
      if (gameData.isHost && error.message === 'Room not found') {
        emitCreateRoom();
        return;
      }

      alert(error.message);
      navigate('/');
    });

    return () => {
      newSocket.close();
    };
  }, [roomId, navigate]);

  const copyRoomLink = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(link);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  const isHost = room && socket && room.host === socket.id;
  const currentIssue = room?.issues.find(i => i.id === room.currentIssueId);

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{room.name || 'Planning Poker'}</h1>
            <p className="text-sm text-gray-600">Room: {roomId}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={copyRoomLink}
              className="px-4 py-2 bg-accent hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors shadow-md relative"
            >
              📋 Copy Room Link
              {showCopyNotification && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('currentGame');
                navigate('/');
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Leave Game
            </button>
          </div>
        </div>
      </header>

      {/* Player List Banner */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <PlayerList players={room.players} currentPlayerId={currentPlayer.id} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Issues Sidebar */}
          <div className="lg:col-span-3">
            <IssueSidebar
              issues={room.issues}
              players={room.players}
              currentIssueId={room.currentIssueId}
              isHost={isHost}
              socket={socket}
              roomId={roomId}
            />
          </div>

          {/* Voting Area */}
          <div className="lg:col-span-6">
            <VotingArea
              room={room}
              currentIssue={currentIssue}
              currentPlayer={currentPlayer}
              isHost={isHost}
              socket={socket}
              roomId={roomId}
            />
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            <ResultsPanel
              room={room}
              currentIssue={currentIssue}
              isHost={isHost}
              socket={socket}
              roomId={roomId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
