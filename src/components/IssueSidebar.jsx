import { useState } from 'react';

function IssueSidebar({ issues, players, currentIssueId, isHost, socket, roomId }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: '', description: '' });
  const [showImport, setShowImport] = useState(false);

  const handleAddIssue = (e) => {
    e.preventDefault();
    if (!newIssue.title.trim()) return;

    const issue = {
      id: `issue_${Date.now()}`,
      title: newIssue.title,
      description: newIssue.description,
      status: 'pending',
      estimate: null,
      votes: {}
    };

    socket.emit('add-issue', { roomId, issue });
    setNewIssue({ title: '', description: '' });
    setShowAddForm(false);
  };

  const handleStartVoting = (issueId) => {
    socket.emit('start-voting', { roomId, issueId });
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const newIssues = [];

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [title, description] = line.split(',').map(s => s.trim());
        if (title) {
          newIssues.push({
            id: `issue_${Date.now()}_${i}`,
            title,
            description: description || '',
            status: 'pending',
            estimate: null,
            votes: {}
          });
        }
      }

      if (newIssues.length > 0) {
        socket.emit('update-issues', { roomId, issues: [...issues, ...newIssues] });
      }
    };
    reader.readAsText(file);
    setShowImport(false);
  };

  const handleExportCSV = () => {
    const escapeCsv = (value) => {
      const stringValue = value === null || value === undefined ? '' : String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const playerMap = Object.fromEntries(players.map((player) => [player.id, player.name]));
    let csv = 'Issue Number,Title,Description,Estimate,Average Vote,Status,Voter Breakdown\n';

    issues.forEach((issue, index) => {
      const voteDetails = issue.finalVoteDetails || [];
      const voteSummary = voteDetails
        .map((detail) => `${detail.name || playerMap[detail.playerId] || 'Unknown'}:${detail.vote}`)
        .join(' | ');

      csv += [
        escapeCsv(index + 1),
        escapeCsv(issue.title),
        escapeCsv(issue.description),
        escapeCsv(issue.estimate || 'N/A'),
        escapeCsv(issue.averageVote ?? 'N/A'),
        escapeCsv(issue.status),
        escapeCsv(voteSummary)
      ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning-poker-results-${Date.now()}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-gray-200 text-gray-700',
      voting: 'bg-blue-500 text-white',
      estimated: 'bg-green-500 text-white'
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Issues</h2>
        {isHost && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              title="Add Issue"
            >
              + Add
            </button>
          </div>
        )}
      </div>

      {/* Import/Export buttons */}
      {isHost && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => document.getElementById('csv-import').click()}
            className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
          >
            📥 Import CSV
          </button>
          <input
            id="csv-import"
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            onClick={handleExportCSV}
            className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
          >
            📤 Export CSV
          </button>
        </div>
      )}

      {/* Add Issue Form */}
      {showAddForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-2 border-primary">
          <form onSubmit={handleAddIssue} className="space-y-2">
            <input
              type="text"
              placeholder="Issue title *"
              value={newIssue.title}
              onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary focus:outline-none text-sm"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newIssue.description}
              onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary focus:outline-none text-sm"
              rows="2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Issues List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {issues.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No issues yet. {isHost && 'Add your first issue!'}
          </p>
        ) : (
          issues.map(issue => (
            <div
              key={issue.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                issue.id === currentIssueId
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => isHost && issue.id !== currentIssueId && handleStartVoting(issue.id)}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-800 flex-1">{issue.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(issue.status)}`}>
                  {issue.status}
                </span>
              </div>
              {issue.description && (
                <p className="text-xs text-gray-600 mb-2">{issue.description}</p>
              )}
              {issue.estimate && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-green-600">
                    Estimate: {issue.estimate}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default IssueSidebar;
