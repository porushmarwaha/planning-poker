import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-6xl font-bold text-primary mb-4">
            🃏 Planning Poker
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Team Estimation Made Easy
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            A fully local, browser-based Planning Poker app for agile teams. 
            No subscription, no backend required. Run it entirely in your browser or on your local network.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => navigate('/new-game')}
            className="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Start New Game
          </button>
          <button
            onClick={() => {
              const roomId = prompt('Enter Room ID:');
              if (roomId) navigate(`/join/${roomId}`);
            }}
            className="bg-white hover:bg-gray-50 text-primary font-bold py-4 px-8 rounded-lg text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-2 border-primary"
          >
            Join Existing Game
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-Time Voting</h3>
            <p className="text-gray-600">
              See votes cast in real-time with smooth animations and instant updates
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Analytics</h3>
            <p className="text-gray-600">
              Visual charts, consensus indicators, and vote distribution analysis
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Beautiful Design</h3>
            <p className="text-gray-600">
              Card-like aesthetics with smooth animations and modern UI
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-12 text-left max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Features:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Multiple deck types: Fibonacci, Modified Fibonacci, T-Shirt Sizes, Powers of 2, Custom</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Issue queue management with drag-and-drop reordering</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>CSV import/export for issues and results</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Spectator mode for observers</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Auto-reveal when all players vote</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Session persistence with localStorage</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
