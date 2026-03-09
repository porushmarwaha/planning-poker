import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ResultsPanel({ room, currentIssue, isHost, socket, roomId }) {
  if (!currentIssue || room.status !== 'revealed') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-[600px] flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Results will appear here after votes are revealed
        </p>
      </div>
    );
  }

  // Calculate vote statistics
  const votes = Object.values(currentIssue.votes || {});
  const numericVotes = votes.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
  
  const voteDistribution = {};
  votes.forEach(vote => {
    voteDistribution[vote] = (voteDistribution[vote] || 0) + 1;
  });

  const chartData = Object.entries(voteDistribution).map(([value, count]) => ({
    value,
    count
  }));

  const stats = {
    total: votes.length,
    min: numericVotes.length > 0 ? Math.min(...numericVotes) : 'N/A',
    max: numericVotes.length > 0 ? Math.max(...numericVotes) : 'N/A',
    avg: numericVotes.length > 0 
      ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
      : 'N/A'
  };

  // Calculate consensus
  const mostCommonVote = Object.entries(voteDistribution)
    .sort((a, b) => b[1] - a[1])[0];
  const consensusPercentage = ((mostCommonVote[1] / votes.length) * 100).toFixed(0);
  
  const getConsensusLevel = () => {
    if (consensusPercentage >= 100) return { label: 'Full Consensus ✅', color: 'text-green-600' };
    if (consensusPercentage >= 70) return { label: 'Near Consensus', color: 'text-blue-600' };
    return { label: 'Discuss 🗣️', color: 'text-orange-600' };
  };

  const consensus = getConsensusLevel();

  const handleSetEstimate = (value) => {
    socket.emit('set-estimate', { roomId, issueId: currentIssue.id, estimate: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Results</h2>

      {/* Consensus Indicator */}
      <div className={`p-4 rounded-lg border-2 ${
        consensusPercentage >= 70 ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'
      }`}>
        <div className="text-center">
          <p className={`text-2xl font-bold ${consensus.color}`}>{consensus.label}</p>
          <p className="text-sm text-gray-600 mt-1">{consensusPercentage}% agreement</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Min</p>
          <p className="text-2xl font-bold text-primary">{stats.min}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Max</p>
          <p className="text-2xl font-bold text-primary">{stats.max}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Average</p>
          <p className="text-2xl font-bold text-primary">{stats.avg}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Total Votes</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
      </div>

      {/* Vote Distribution Chart */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Vote Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="value" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#327ACF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Votes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Individual Votes</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {room.players.filter(p => !p.isSpectator).map(player => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm text-gray-800">{player.name}</span>
              <span className="text-lg font-bold text-primary">
                {player.currentVote || '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Set Estimate (Host Only) */}
      {isHost && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Set Final Estimate</h3>
          <div className="flex flex-wrap gap-2">
            {room.deck.filter(v => !['?', '☕'].includes(v)).map(value => (
              <button
                key={value}
                onClick={() => handleSetEstimate(value)}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  currentIssue.estimate === value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          {currentIssue.estimate && (
            <p className="text-sm text-green-600 font-semibold mt-2">
              ✅ Estimate set to: {currentIssue.estimate}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
