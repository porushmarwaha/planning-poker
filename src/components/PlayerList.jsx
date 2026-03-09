function getPlayerColor(name) {
  // Generate a consistent color based on player name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200',
    'bg-purple-200', 'bg-indigo-200', 'bg-red-200', 'bg-orange-200'
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function PlayerList({ players, currentPlayerId }) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto">
      <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
        Players ({players.length}):
      </span>
      <div className="flex gap-3">
        {players.map(player => (
          <div
            key={player.id}
            className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1 border-2 border-gray-200"
          >
            <div className={`w-8 h-8 rounded-full ${getPlayerColor(player.name)} flex items-center justify-center font-bold text-sm`}>
              {getInitials(player.name)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                {player.name}
                {player.id === currentPlayerId && ' (You)'}
              </span>
              {player.isSpectator && (
                <span className="text-xs text-gray-500">Spectator</span>
              )}
            </div>
            {!player.isSpectator && player.currentVote && (
              <span className="text-green-500">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;
