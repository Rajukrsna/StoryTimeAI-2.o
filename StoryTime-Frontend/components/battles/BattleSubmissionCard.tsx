'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Eye, 
  Trophy, 
  Calendar, 
  FileText, 
   
  ChevronDown, 
  ChevronUp,
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Submission {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
  author: { _id: string; name: string; profilePicture: string };
  submittedAt: string;
  totalVotes: number;
  ranking: number;
  votes: Array<{ user: string }>;
}

interface BattleSubmissionCardProps {
  submission: Submission;
  canVote: boolean;
  hasVoted: boolean;
  onVote: () => void;
  showRanking: boolean;
}

const BattleSubmissionCard: React.FC<BattleSubmissionCardProps> = ({
  submission,
  canVote,
  hasVoted,
  onVote,
  showRanking
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (isVoting || hasVoted || !canVote) return;
    
    setIsVoting(true);
    try {
      await onVote();
    } finally {
      setIsVoting(false);
    }
  };

  const getRankingIcon = (ranking: number) => {
    switch (ranking) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankingColor = (ranking: number) => {
    switch (ranking) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getPreviewText = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
      showRanking ? getRankingColor(submission.ranking) : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {showRanking && (
              <div className="flex items-center">
                {getRankingIcon(submission.ranking)}
                <span className="ml-1 font-bold text-lg text-gray-900">
                  #{submission.ranking}
                </span>
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
              {submission.title}
            </h3>
          </div>
          
          {/* Author Info */}
          <div className="flex items-center mb-3">
            <img 
              src={submission.author.profilePicture || '/default-avatar.png'} 
              alt={submission.author.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">{submission.author.name}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vote Section */}
        <div className="flex flex-col items-center ml-4">
          <button
            onClick={handleVote}
            disabled={!canVote || hasVoted || isVoting}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              hasVoted
                ? 'bg-red-100 text-red-700 cursor-not-allowed'
                : canVote
                ? 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isVoting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Heart className={`w-4 h-4 mr-2 ${hasVoted ? 'fill-current' : ''}`} />
            )}
            {hasVoted ? 'Voted' : 'Vote'}
          </button>
          
          <div className="mt-2 text-center">
            <span className="text-lg font-bold text-gray-900">{submission.totalVotes}</span>
            <p className="text-xs text-gray-500">votes</p>
          </div>
        </div>
      </div>

      {/* Story Preview */}
      <div className="mb-4">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {isExpanded ? submission.content : getPreviewText(submission.content)}
          </p>
        </div>
        
        {submission.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Read More
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            <span>{submission.wordCount} words</span>
          </div>
          
          {showRanking && submission.ranking <= 3 && (
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-1 text-yellow-600" />
              <span className="font-medium text-yellow-700">
                {submission.ranking === 1 ? 'Winner' : 
                 submission.ranking === 2 ? 'Runner-up' : 
                 '3rd Place'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Reading Time Estimate */}
          <span className="text-xs text-gray-400">
            ~{Math.ceil(submission.wordCount / 200)} min read
          </span>
        </div>
      </div>

      {/* Winner Badge for 1st place */}
      {showRanking && submission.ranking === 1 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg">
          <div className="flex items-center justify-center text-white">
            <Crown className="w-5 h-5 mr-2" />
            <span className="font-bold text-sm">🎉 WINNER 🎉</span>
          </div>
        </div>
      )}

      {/* Vote Status Indicator */}
      {hasVoted && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800 text-sm">
            <Heart className="w-4 h-4 mr-2 fill-current" />
            <span>You voted for this submission</span>
          </div>
        </div>
      )}

      {/* Cannot Vote Indicator */}
      {!canVote && !hasVoted && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center text-gray-600 text-sm">
            <Eye className="w-4 h-4 mr-2" />
            <span>
              {submission.author._id === localStorage.getItem('user') ? 
                'This is your submission' : 
                'Voting not available'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleSubmissionCard;