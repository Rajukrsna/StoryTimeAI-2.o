'use client';

import React, { useState, useEffect,useCallback } from 'react';
import { 
  Clock, 
  Users, 
  Trophy, 
  Calendar, 
  Zap, 
  Edit3, 
  Vote, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Heart,
  Star,
  Award,
  Ghost,
  Rocket,
  Search,
  Sword,
  Flame,
  Smile,
  Book,
  PartyPopper,
  Shield
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import LoadingSpinner from '../LoadingSpinner';
import BattleSubmissionModal from "./BattleSubmissionModal"
import BattleSubmissionCard from './BattleSubmissionCard';
import BattleTimer from './BattleTimer';
import {Navbar} from '../Navbar';
import { 
  getBattleById, 
  getBattleSubmissions, 
  joinBattle, 
  voteForSubmission,
  type Battle,
  type Submission 
} from '@/api/battle';
import { getMyProfile } from '@/api/profile';

interface BattleDetailProps {
  battleId: string;
}

const BattleDetail: React.FC<BattleDetailProps> = ({ battleId }) => {
  const [battle, setBattle] = useState<Battle | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions'>('overview');
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchUserProfile = async() => {
      try {
        const userData = await getMyProfile();
        if (userData && userData._id !== currentUserId) {
          setCurrentUserId(userData._id);
        }
      } catch(error) {
        console.error('Error fetching user profile:', error); 
      }
    };

    const fetchBattleDetails = async () => {
      try {
        const response = await getBattleById(battleId);
        if (response.success) {
          setBattle(response.battle);
        }
      } catch (error) {
        console.error('Error fetching battle details:', error);
      }
    };

    fetchUserProfile();
    fetchBattleDetails();
  }, [battleId]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchSubmissions = async () => {
      try {
        const response = await getBattleSubmissions(battleId);
        if (response && response.success && Array.isArray(response.submissions)) {
          setSubmissions(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(response.submissions)) {
              return response.submissions;
            }
            return prev;
          });

          const userSub = response.submissions.find(
            (sub: Submission) => sub.author._id === currentUserId
          );
          setUserSubmission(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(userSub || null)) {
              return userSub || null;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [currentUserId, battleId]);

  const handleJoinBattle = useCallback(async () => {
    try {
      const response = await joinBattle(battleId);
      if (response.success) {
        setBattle(response.battle);
        alert('Successfully joined the battle!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to join battle';
      alert(message);
    }
  }, [battleId]);

  const handleVote = useCallback(async (submissionId: string) => {
    try {
      const response = await voteForSubmission(submissionId);
      if (response.success) {
        setSubmissions(prev => prev.map(sub => 
          sub._id === submissionId ? response.submission : sub
        ));
        
        setBattle(prev => prev ? {
          ...prev,
          totalVotes: response.battleTotalVotes
        } : null);
        
        alert('Vote recorded successfully!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to vote';
      alert(message);
    }
  }, []);

  const handleSubmissionSuccess = useCallback((newSubmission: Submission) => {
    setShowSubmissionModal(false);
    
    setSubmissions(prev => [newSubmission, ...prev]);
    setUserSubmission(newSubmission);
    
    setBattle(prev => prev ? {
      ...prev,
      participants: prev.participants.map(p => 
        p.user._id === currentUserId 
          ? { ...p, submission: newSubmission }
          : p
      )
    } : null);
  }, [currentUserId]);

  // ✅ Gray-themed status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'active': return 'bg-gray-700 text-white border-gray-800';
      case 'voting': return 'bg-gray-600 text-white border-gray-700';
      case 'completed': return 'bg-gray-800 text-gray-200 border-gray-900';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThemeIcon = (theme: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      horror: <Ghost className="w-4 h-4 mr-2 inline" />,
      'sci-fi': <Rocket className="w-4 h-4 mr-2 inline" />,
      romance: <Heart className="w-4 h-4 mr-2 inline" />,
      fantasy: <Flame className="w-4 h-4 mr-2 inline" />,
      mystery: <Search className="w-4 h-4 mr-2 inline" />,
      adventure: <Sword className="w-4 h-4 mr-2 inline" />,
      thriller: <Shield className="w-4 h-4 mr-2 inline" />,
      comedy: <Smile className="w-4 h-4 mr-2 inline" />
    };
    return icons[theme] || <Book className="w-4 h-4 mr-2 inline" />;
  };

  // ✅ Gray-themed gradients
  const getThemeColor = (theme: string) => {
    return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white';
  };

  const isUserParticipant = currentUserId && battle?.participants.some(p => p.user._id === currentUserId);
  const canJoin = battle?.status === 'upcoming' && battle.participants.length < battle.maxParticipants && !isUserParticipant;
  const canSubmit = battle?.status === 'active' && isUserParticipant && !userSubmission;
  const canVote = battle?.status === 'voting' && currentUserId;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (!battle) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
            <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-gray-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Battle Not Found</h2>
            <p className="text-gray-600 mb-8">The battle you're looking for doesn't exist.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      {/* ✨ Beautiful gray gradient background with animated particles */}
      <div className="min-h-screen pt-16 lg:pt-23 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
        {/* Animated background elements - Gray theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-20 w-72 h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-all duration-300 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Battles</span>
          </button>

          {/* 🏆 Hero Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-8 mb-8 overflow-hidden relative">
            {/* Decorative elements - Gray theme */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full -translate-y-20 translate-x-20 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-lg ${getStatusColor(battle.status)}`}>
                      <Star className="w-4 h-4 mr-2 inline" />
                      {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
                    </span>
                    <span className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-lg ${getThemeColor(battle.theme)}`}>
                      {getThemeIcon(battle.theme)} {battle.theme.charAt(0).toUpperCase() + battle.theme.slice(1)}
                    </span>
                  </div>
                  {/* ✅ Gray gradient title */}
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
                    {battle.title}
                  </h1>
                  <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">{battle.description}</p>
                </div>

                {/* Action Buttons - Gray theme */}
                <div className="mt-8 lg:mt-0 lg:ml-8 flex flex-col gap-4">
                  {canJoin && (
                    <button
                      onClick={handleJoinBattle}
                      className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-8 py-4 rounded-xl hover:from-gray-700 hover:to-gray-900 transition-all duration-300 font-bold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Join Battle
                    </button>
                  )}
                  
                  {canSubmit && (
                    <button
                      onClick={() => setShowSubmissionModal(true)}
                      className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 font-bold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Edit3 className="w-5 h-5 mr-2" />
                      Submit Story
                    </button>
                  )}

                  {isUserParticipant && (
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-8 py-4 rounded-xl text-center font-bold border-2 border-gray-300 shadow-lg">
                      <CheckCircle className="w-5 h-5 mr-2 inline" />
                      Participating
                    </div>
                  )}
                </div>
              </div>

              {/* ✨ Beautiful Stats Grid  */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-br from-gray-600 to-gray-800 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {battle.participants.length}/{battle.maxParticipants}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Participants</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-br from-gray-500 to-gray-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{submissions.length}</div>
                  <p className="text-sm text-gray-600 font-medium">Submissions</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Vote className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{battle.totalVotes || 0}</div>
                  <p className="text-sm text-gray-600 font-medium">Total Votes</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {battle.prizes?.length || 3}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Prize Tiers</p>
                </div>
              </div>

              {/* Timer */}
              <div className="mt-8">
                <BattleTimer battle={battle} />
              </div>
            </div>
          </div>

          {/* 🏆 Winner Announcement  */}
        {/* 🏆✨ Enhanced Winner Announcement */}
{battle.winner && (
  <div className="relative mb-8">
    {/* 🎊 Confetti Animation Background */}
    <div className="absolute inset-0 overflow-hidden rounded-3xl">
      <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-8 right-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-12 left-16 w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-6 right-16 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-16 left-8 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-4 right-4 w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute bottom-8 left-12 w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
      <div className="absolute bottom-12 right-12 w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '1.3s' }}></div>
    </div>

    {/* 🌟 Main Winner Card */}
    <div className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50 border-4 border-yellow-300 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* ✨ Sparkle Overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-8 w-4 h-4 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-12 right-12 w-3 h-3 bg-amber-400 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-16 w-5 h-5 bg-yellow-200 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-16 right-8 w-3 h-3 bg-orange-300 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* 🎯 Content Container */}
      <div className="relative z-10">
        {/* 🏆 Trophy & Title Section */}
        <div className="text-center mb-8">
          {/* Animated Trophy */}
          <div className="relative inline-block mb-6">
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 p-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse">
              <Trophy className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
            {/* Trophy Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-full opacity-30 animate-ping"></div>
          </div>

          {/* ✅ Champion Title with Lucide Icons */}
          <div className="relative">
            <h3 className="text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text mb-4 drop-shadow-lg flex items-center justify-center gap-4">
              <PartyPopper className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-500" />
              CHAMPION!
              <PartyPopper className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-500" />
            </h3>
            {/* Title Shadow Effect */}
            <div className="absolute inset-0 text-5xl lg:text-6xl font-black text-yellow-200 -z-10 transform translate-x-1 translate-y-1 opacity-50 flex items-center justify-center gap-4">
              <PartyPopper className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-300" />
              CHAMPION!
              <PartyPopper className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-300" />
            </div>
          </div>

          {/* ✅ Subtitle with Lucide Icons */}
          <p className="text-xl text-amber-700 font-semibold mb-8 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-amber-600 fill-current" />
            The writing master has emerged victorious!
            <Star className="w-6 h-6 text-amber-600 fill-current" />
          </p>
        </div>

        {/* ✅ Winner Profile Section with Crown Icon */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-yellow-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Profile Image with Crown Icon */}
            <div className="relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                <Award className="w-8 h-8 text-yellow-500 fill-current" />
              </div>
              <img
                src={battle.winner.profilePicture || '/default-avatar.png'}
                alt={battle.winner.name}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-6 border-yellow-400 shadow-xl transform hover:scale-105 transition-all duration-300"
              />
              {/* Profile Glow */}
              <div className="absolute inset-0 rounded-full border-6 border-yellow-300 opacity-50 animate-ping"></div>
            </div>

            {/* Winner Info */}
            <div className="text-center lg:text-left">
              <h4 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center lg:justify-start gap-3">
                <span>{battle.winner.name}</span>
                <div className="flex space-x-1">
                  <Star className="w-6 h-6 text-yellow-500 fill-current animate-pulse" />
                  <Star className="w-6 h-6 text-yellow-500 fill-current animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <Star className="w-6 h-6 text-yellow-500 fill-current animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </h4>
              
              {/* Achievement Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Battle Winner
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Story Master
                </div>
                <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Most Votes
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-6 text-center">
                <div className="bg-yellow-100 rounded-xl p-3 border-2 border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700 flex items-center justify-center gap-1">
                    <Heart className="w-5 h-5 text-yellow-600" />
                    {submissions.find(s => s.author._id === battle.winner?._id)?.totalVotes || 0}
                  </div>
                  <div className="text-sm text-yellow-600 font-medium">Votes</div>
                </div>
                <div className="bg-amber-100 rounded-xl p-3 border-2 border-amber-200">
                  <div className="text-2xl font-bold text-amber-700 flex items-center justify-center gap-1">
                    <Edit3 className="w-5 h-5 text-amber-600" />
                    {submissions.find(s => s.author._id === battle.winner?._id)?.wordCount || 0}
                  </div>
                  <div className="text-sm text-amber-600 font-medium">Words</div>
                </div>
                <div className="bg-orange-100 rounded-xl p-3 border-2 border-orange-200">
                  <div className="text-2xl font-bold text-orange-700 flex items-center justify-center gap-1">
                    <Trophy className="w-5 h-5 text-orange-600" />
                    #1
                  </div>
                  <div className="text-sm text-orange-600 font-medium">Rank</div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Celebration Message with Lucide Icons */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-yellow-200 to-amber-200 rounded-2xl p-6 border-2 border-yellow-300">
              <p className="text-lg text-amber-800 font-semibold mb-2 flex items-center justify-center gap-2">
                <PartyPopper className="w-5 h-5 text-amber-700" />
                Congratulations on your incredible victory!
                <PartyPopper className="w-5 h-5 text-amber-700" />
              </p>
              <p className="text-amber-700 flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-amber-600 fill-current" />
                Your story captivated readers and earned the most votes. You are now the Battle Champion!
                <Star className="w-4 h-4 text-amber-600 fill-current" />
              </p>
            </div>
          </div>
        </div>

        {/* 🎯 Call to Action */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => setActiveTab('submissions')}
            className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
          >
            <Eye className="w-5 h-5 mr-2" />
            View Winning Story
            <PartyPopper className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  </div>
)}

          {/* ✨ Tab Navigation  */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="border-b border-gray-200/50">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-8 py-6 font-bold text-lg border-b-4 transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'border-gray-600 text-gray-700 bg-gray-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-5 h-5 mr-2 inline" />Overview
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`px-8 py-6 font-bold text-lg border-b-4 transition-all duration-300 ${
                    activeTab === 'submissions'
                      ? 'border-gray-600 text-gray-700 bg-gray-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Edit3 className="w-5 h-5 mr-2 inline" />Submissions ({submissions.length})
                </button>
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  {/* Battle Information */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <Calendar className="w-6 h-6 mr-3 text-gray-600" />
                      Battle Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-2 rounded-lg mr-3">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Start Time</p>
                              <p className="font-bold text-gray-800">{format(new Date(battle.startTime), 'PPP p')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-2 rounded-lg mr-3">
                              <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">End Time</p>
                              <p className="font-bold text-gray-800">{format(new Date(battle.endTime), 'PPP p')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-2 rounded-lg mr-3">
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Battle Type</p>
                              <p className="font-bold text-gray-800 capitalize">{battle.battleType?.replace('_', ' ')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-2 rounded-lg mr-3">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Voting Ends</p>
                              <p className="font-bold text-gray-800">{format(new Date(battle.votingEndTime), 'PPP p')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <Users className="w-6 h-6 mr-3 text-gray-600" />
                      Participants ({battle.participants.length}/{battle.maxParticipants})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {battle.participants.map((participant, index) => (
                        <div key={participant.user._id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center">
                            <img 
                              src={participant.user.profilePicture || '/default-avatar.png'} 
                              alt={participant.user.name}
                              className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-gray-800">{participant.user.name}</p>
                              <p className="text-sm text-gray-600">
                                Joined {formatDistanceToNow(new Date(participant.joinedAt), { addSuffix: true })}
                              </p>
                            </div>
                            {participant.submission && (
                              <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-2 rounded-full">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prizes  */}
                  {battle.prizes && battle.prizes.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <Trophy className="w-6 h-6 mr-3 text-gray-600" />
                        Prize Pool
                      </h3>
                      <div className="space-y-4">
                        {battle.prizes.map((prize) => (
                          <div key={prize.position} className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-br from-gray-600 to-gray-800 w-12 h-12 rounded-2xl flex items-center justify-center mr-6 text-white font-bold text-lg">
                                {prize.position}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-800 text-lg">{prize.reward}</p>
                                <p className="text-gray-600 font-medium">{prize.points} points</p>
                              </div>
                              <Award className="w-8 h-8 text-gray-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'submissions' && (
                <div>
                  {submissions.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
                        <Edit3 className="w-16 h-16 text-gray-700" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">No submissions yet</h3>
                      <p className="text-gray-600 text-lg">Be the first to submit your story!</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {submissions.map((submission) => (
                        <BattleSubmissionCard
                          key={submission._id}
                          submission={submission}
                          canVote={Boolean(canVote && submission.author._id !== currentUserId)}
                          hasVoted={submission.votes.some(v => v.user === currentUserId)}
                          onVote={() => handleVote(submission._id)}
                          showRanking={battle.status === 'completed'}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submission Modal */}
          {showSubmissionModal && (
            <BattleSubmissionModal
              battleId={battleId}
              battleTitle={battle.title}
              onClose={() => setShowSubmissionModal(false)}
              onSubmissionSuccess={handleSubmissionSuccess}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default BattleDetail;