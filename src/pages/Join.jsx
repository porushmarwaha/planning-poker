import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Join() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [isSpectator, setIsSpectator] = useState(false);

  useEffect(() => {
    // Load saved player name
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    
    const joinData = {
      roomId,
      playerName,
      isSpectator,
      isHost: false
    };
    
    localStorage.setItem('currentGame', JSON.stringify(joinData));
    localStorage.setItem('playerName', playerName);
    
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Join Game</h1>
            <p className="text-gray-600">Room ID: <span className="font-mono font-bold">{roomId}</span></p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="Enter your name"
                autoFocus
              />
            </div>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSpectator}
                onChange={(e) => setIsSpectator(e.target.checked)}
                className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <span className="ml-3 text-gray-700 font-medium">Join as Spectator (watch only)</span>
            </label>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Join Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Join;
