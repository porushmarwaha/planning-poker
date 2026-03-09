import { useState } from 'react';
import Card from './Card';

function VotingArea({ room, currentIssue, currentPlayer, isHost, socket, roomId }) {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (value) => {
    if (currentPlayer.isSpectator || room.status === 'revealed') return;
    
    setSelectedCard(value);
    socket.emit('cast-vote', { roomId, vote: value });
  };

  const handleReveal = () => {
    socket.emit('reveal-votes', { roomId });
  };

  const handleNewRound = () => {
    setSelectedCard(null);
    socket.emit('new-round', { roomId });
  };

  const handleNextIssue = () => {
    const currentIndex = room.issues.findIndex(i => i.id === room.currentIssueId);
    const nextIssue = room.issues[currentIndex + 1];
    if (nextIssue) {
      setSelectedCard(null);
      socket.emit('start-voting', { roomId, issueId: nextIssue.id });
    }
  };

  // Count non-spectator players
  const totalVoters = room.players.filter(p => !p.isSpectator).length;
  const votedCount = room.players.filter(p => !p.isSpectator && p.currentVote !== null).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[600px] flex flex-col">
      {/* Current Issue */}
      {currentIssue ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{currentIssue.title}</h2>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                room.status === 'voting' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {room.status === 'voting' ? '🗳️ Voting' : '✅ Revealed'}
              </span>
            </div>
            {currentIssue.description && (
              <p className="text-gray-600">{currentIssue.description}</p>
            )}
          </div>

          {/* Voting Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">
                {votedCount} / {totalVoters} voted
              </span>
              <div className="text-sm text-gray-600">
                {room.status === 'voting' && room.autoReveal && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Auto-reveal enabled
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(votedCount / totalVoters) * 100}%` }}
              />
            </div>
          </div>

          {/* Player Status Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Players:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {room.players.filter(p => !p.isSpectator).map(player => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg border-2 ${
                    player.currentVote
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {player.name}
                    </span>
                    {room.status === 'revealed' && player.currentVote ? (
                      <span className="text-xl font-bold text-primary ml-2">
                        {player.currentVote}
                      </span>
                    ) : player.currentVote ? (
                      <span className="text-green-500 ml-2">✓</span>
                    ) : (
                      <span className="text-gray-400 ml-2">⏳</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Host Controls */}
          {isHost && room.status === 'voting' && (
            <div className="mb-6">
              <button
                onClick={handleReveal}
                disabled={votedCount === 0}
                className="w-full py-3 bg-accent hover:bg-yellow-500 text-gray-800 font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎭 Reveal Votes
              </button>
            </div>
          )}

          {/* Post-Reveal Controls */}
          {isHost && room.status === 'revealed' && (
            <div className="mb-6 flex gap-3">
              <button
                onClick={handleNewRound}
                className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg"
              >
                🔄 New Round
              </button>
              <button
                onClick={handleNextIssue}
                disabled={room.issues.findIndex(i => i.id === room.currentIssueId) === room.issues.length - 1}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➡️ Next Issue
              </button>
            </div>
          )}

          {/* Card Hand */}
          {!currentPlayer.isSpectator && (
            <div className="mt-auto">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                {room.status === 'voting' ? 'Pick your card:' : 'Votes revealed!'}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {room.deck.map(value => (
                  <Card
                    key={value}
                    value={value}
                    isSelected={selectedCard === value}
                    isRevealed={room.status === 'revealed'}
                    onClick={() => handleCardSelect(value)}
                    disabled={room.status === 'revealed'}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl text-gray-400 mb-4">No active voting</p>
            <p className="text-gray-600">
              {isHost 
                ? 'Click an issue from the sidebar to start voting'
                : 'Waiting for host to start voting...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VotingArea;
