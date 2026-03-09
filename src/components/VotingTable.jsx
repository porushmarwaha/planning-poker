function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function VotingTable({ players, status }) {
  const voters = players.filter((player) => !player.isSpectator);
  const playerCount = Math.max(voters.length, 1);

  const tableWidth = Math.min(560, 300 + playerCount * 35);
  const tableHeight = Math.min(300, 170 + playerCount * 16);
  const centerX = tableWidth / 2;
  const centerY = tableHeight / 2;
  const radiusX = tableWidth / 2 + 48;
  const radiusY = tableHeight / 2 + 38;

  return (
    <div className="w-full mb-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">Team Table</h3>
      <div className="relative mx-auto" style={{ width: `${tableWidth + 120}px`, height: `${tableHeight + 120}px` }}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary/30 bg-gradient-to-br from-blue-200 to-blue-100 shadow-inner transition-all duration-300"
          style={{ width: `${tableWidth}px`, height: `${tableHeight}px` }}
        >
          <div className="absolute inset-4 rounded-full border border-primary/20" />
          <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-lg">
            Planning Table
          </div>
        </div>

        {voters.map((player, index) => {
          const angle = (2 * Math.PI * index) / playerCount - Math.PI / 2;
          const seatX = centerX + radiusX * Math.cos(angle);
          const seatY = centerY + radiusY * Math.sin(angle);
          const isVoted = !!player.currentVote;
          const voteLabel = status === 'revealed' ? player.currentVote || '-' : isVoted ? '✓' : '...';

          return (
            <div
              key={player.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${seatX + 60}px`, top: `${seatY + 60}px` }}
            >
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                isVoted ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-300 text-gray-700'
              }`}>
                {getInitials(player.name)}
              </div>
              <div className="mt-1 text-center text-xs font-medium text-gray-700 w-20 -ml-2 truncate">
                {player.name}
              </div>
              <div className="text-center text-xs font-semibold text-primary mt-0.5">
                {voteLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VotingTable;
