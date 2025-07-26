import React from 'react';
import { Clock, Users, Trophy, Zap, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface BattleCardProps {
  battle: {
    _id: string;
    title: string;
    description: string;
    theme: string;
    status: 'upcoming' | 'active' | 'voting' | 'completed';
    startTime: string;
    endTime: string;
    votingEndTime: string;
    participants: Array<{ user: { _id: string; name: string; profilePicture: string } }>;
    maxParticipants: number;
    totalVotes?: number;
    winner?: { _id: string; name: string; profilePicture: string };
    createdBy: { _id: string; name: string; profilePicture: string };
  };
  onJoin?: (battleId: string) => void;
  onView?: (battleId: string) => void;
  currentUserId?: string|null;
}

const BattleCard: React.FC<BattleCardProps> = ({ battle, onJoin, onView, currentUserId }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'active': return 'bg-gray-700 text-white border-gray-800';
      case 'voting': return 'bg-gray-600 text-white border-gray-700';
      case 'completed': return 'bg-gray-800 text-gray-200 border-gray-900';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThemeColor = (theme: string) => {
    // ✅ All themes now use consistent gray tones
    const colors: { [key: string]: string } = {
      horror: 'text-gray-800 bg-gray-100',
      'sci-fi': 'text-gray-800 bg-gray-100',
      romance: 'text-gray-800 bg-gray-100',
      fantasy: 'text-gray-800 bg-gray-100',
      mystery: 'text-gray-800 bg-gray-100',
      adventure: 'text-gray-800 bg-gray-100',
      thriller: 'text-gray-800 bg-gray-100',
      comedy: 'text-gray-800 bg-gray-100'
    };
    return colors[theme] || 'text-gray-600 bg-gray-50';
  };

  const getTimeText = () => {
    const now = new Date();
    const startTime = new Date(battle.startTime);
    const endTime = new Date(battle.endTime);
    const votingEndTime = new Date(battle.votingEndTime);

    if (battle.status === 'upcoming') {
      return `Starts ${formatDistanceToNow(startTime, { addSuffix: true })}`;
    } else if (battle.status === 'active') {
      return `Ends ${formatDistanceToNow(endTime, { addSuffix: true })}`;
    } else if (battle.status === 'voting') {
      return `Voting ends ${formatDistanceToNow(votingEndTime, { addSuffix: true })}`;
    } else {
      return 'Completed';
    }
  };

  const isUserParticipant = currentUserId && battle.participants.some(p => p.user._id === currentUserId);
  const isBattleFull = battle.participants.length >= battle.maxParticipants;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300 hover:bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{battle.title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(battle.status)}`}>
              {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getThemeColor(battle.theme)}`}>
              {battle.theme.charAt(0).toUpperCase() + battle.theme.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{battle.description}</p>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-1" />
          <span>{battle.participants.length}/{battle.maxParticipants} participants</span>
        </div>
        {battle.status === 'voting' && (
          <div className="flex items-center text-gray-600">
            <Trophy className="w-4 h-4 mr-1" />
            <span>{battle.totalVotes || 0} votes</span>
          </div>
        )}
      </div>

      {/* Time Info */}
      <div className="flex items-center text-gray-500 mb-4">
        <Clock className="w-4 h-4 mr-1" />
        <span className="text-sm">{getTimeText()}</span>
      </div>

      {/* Winner Display */}
      {battle.winner && (
        <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-300">
          <Trophy className="w-5 h-5 text-gray-700 mr-2" />
          <div className="flex items-center">
            <img 
              src={battle.winner.profilePicture || '/default-avatar.png'} 
              alt={battle.winner.name}
              className="w-6 h-6 rounded-full mr-2 border border-gray-300"
            />
            <span className="text-sm font-medium text-gray-900">
              Winner: {battle.winner.name}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {battle.status === 'upcoming' && onJoin && !isUserParticipant && (
          <button
            onClick={() => onJoin(battle._id)}
            disabled={isBattleFull}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
              isBattleFull 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isBattleFull ? 'Battle Full' : 'Join Battle'}
          </button>
        )}
        
        {isUserParticipant && (
          <div className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white text-center font-medium shadow-lg border border-gray-700">
            ✓ Joined
          </div>
        )}
        
        <button
          onClick={() => onView?.(battle._id)}
          className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium shadow-sm hover:shadow-lg"
        >
          View Details
        </button>
      </div>

      {/* Creator Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <img 
            src={battle.createdBy.profilePicture || '/default-avatar.png'} 
            alt={battle.createdBy.name}
            className="w-5 h-5 rounded-full mr-2 border border-gray-200"
          />
          <span>Created by {battle.createdBy.name}</span>
        </div>
      </div>
    </div>
  );
};

export default BattleCard;