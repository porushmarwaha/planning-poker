import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const DECK_PRESETS = {
  fibonacci: {
    name: 'Fibonacci',
    values: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89']
  },
  modified: {
    name: 'Modified Fibonacci',
    values: ['0', '½', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕']
  },
  tshirt: {
    name: 'T-Shirt Sizes',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  powers: {
    name: 'Powers of 2',
    values: ['1', '2', '4', '8', '16', '32', '64']
  },
  custom: {
    name: 'Custom',
    values: []
  }
};

function NewGame() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gameName: '',
    deckType: 'modified',
    customDeck: '',
    allowSpectators: true,
    autoReveal: true,
    playerName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const roomId = Math.random().toString(36).substring(2, 9);
    let deck = DECK_PRESETS[formData.deckType].values;
    
    if (formData.deckType === 'custom' && formData.customDeck) {
      deck = formData.customDeck.split(',').map(v => v.trim());
    }

    // Save to localStorage
    const gameData = {
      roomId,
      gameName: formData.gameName || 'Planning Poker Session',
      deck,
      allowSpectators: formData.allowSpectators,
      autoReveal: formData.autoReveal,
      playerName: formData.playerName,
      isHost: true
    };
    
    localStorage.setItem('currentGame', JSON.stringify(gameData));
    localStorage.setItem('playerName', formData.playerName);
    
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Create New Game</h1>
          <p className="text-gray-600 mb-8">Set up your planning poker session</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>

            {/* Game Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Game Name (Optional)
              </label>
              <input
                type="text"
                value={formData.gameName}
                onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="e.g., Sprint 42 Planning"
              />
            </div>

            {/* Deck Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Deck *
              </label>
              <select
                value={formData.deckType}
                onChange={(e) => setFormData({ ...formData, deckType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              >
                {Object.entries(DECK_PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name}
                    {preset.values.length > 0 && ` (${preset.values.join(', ')})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Deck Input */}
            {formData.deckType === 'custom' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Values (comma-separated) *
                </label>
                <input
                  type="text"
                  required={formData.deckType === 'custom'}
                  value={formData.customDeck}
                  onChange={(e) => setFormData({ ...formData, customDeck: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g., 1, 2, 3, 5, 8, 13, ?"
                />
              </div>
            )}

            {/* Toggles */}
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowSpectators}
                  onChange={(e) => setFormData({ ...formData, allowSpectators: e.target.checked })}
                  className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary"
                />
                <span className="ml-3 text-gray-700 font-medium">Allow Spectators</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoReveal}
                  onChange={(e) => setFormData({ ...formData, autoReveal: e.target.checked })}
                  className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary"
                />
                <span className="ml-3 text-gray-700 font-medium">Auto-reveal when all players vote</span>
              </label>
            </div>

            {/* Buttons */}
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
                Create Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewGame;
