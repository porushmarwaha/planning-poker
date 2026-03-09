function Card({ value, isSelected, isRevealed, onClick, disabled }) {
  const getSuitSymbol = () => {
    const suits = ['♠', '♥', '♣', '♦'];
    const hash = value.toString().charCodeAt(0) || 0;
    return suits[hash % suits.length];
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-28 rounded-lg border-2 transition-all duration-200
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:-translate-y-2 hover:shadow-xl'}
        ${isSelected 
          ? 'border-accent shadow-lg transform -translate-y-2 ring-4 ring-accent ring-opacity-50' 
          : 'border-gray-300 shadow-md hover:border-primary'
        }
        bg-white
      `}
    >
      {/* Front Face */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        {/* Top corner */}
        <div className="absolute top-1 left-1.5 text-xs text-gray-600">
          {getSuitSymbol()}
        </div>
        
        {/* Center value */}
        <div className="text-3xl font-bold text-primary">
          {value}
        </div>
        
        {/* Bottom corner (upside down) */}
        <div className="absolute bottom-1 right-1.5 text-xs text-gray-600 transform rotate-180">
          {getSuitSymbol()}
        </div>
      </div>

      {/* Selected indicator glow */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg bg-accent opacity-10 pointer-events-none" />
      )}
    </button>
  );
}

export default Card;
