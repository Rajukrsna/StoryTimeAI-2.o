'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Trophy, Zap, Users, Sword } from 'lucide-react';
import BattleCard from './BattleCard';
import CreateBattleModal from './CreateBattleModal';
import LoadingSpinner from '../LoadingSpinner';
import {getBattles, joinBattle} from "@/api/battle";
import {useRouter} from 'next/navigation';
import {Navbar} from '../Navbar';
import {getMyProfile} from "@/api/profile";
interface Battle {
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
}



const BattleDashboard: React.FC = () => {
  const router = useRouter(); 
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const themes = ['horror', 'sci-fi', 'romance', 'fantasy', 'mystery', 'adventure', 'thriller', 'comedy'];
  const statuses = ['upcoming', 'active', 'voting', 'completed'];



  useEffect(() => {
    // Get current user ID from localStorage or context
    const getUserProfile = async( ) =>{
      try{
    const user = await getMyProfile();
      setCurrentUserId( user._id);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  getUserProfile();
    fetchBattles();
  }, [statusFilter, themeFilter, currentPage]);

 

useEffect(() => {
  // Reset to page 1 when search term changes
  setCurrentPage(1);
}, [searchTerm]);

  //fetch ALL the battles
  const fetchBattles = async () => {
    try {
      console.log("Fetching battles with filters:")
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
    console.log("Current page:", currentPage);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (themeFilter !== 'all') params.append('theme', themeFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await getBattles(params);
      console.log("Fetched battles:", response.battles);
      if (response.success) {
        setBattles(response.battles);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching battles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBattle = async (battleId: string) => {
    try {
      const response = await joinBattle(battleId)
      
      if (response.success) {
        fetchBattles(); // Refresh battles
        alert('Successfully joined the battle!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to join battle';
      alert(message);
    }
  };

  const handleViewBattle = (battleId: string) => {
     router.push(`/battle/${battleId}`);
  }

const handleBattleCreated = async (newBattle?: Battle) => {

  console.log("Battle created:", newBattle);
  setShowCreateModal(false);

  if (newBattle) {
    // Reset filters to ensure the new battle matches
    setBattles(prev => [newBattle, ...prev]);
    setStatusFilter('all');
    setThemeFilter('all');
    setSearchTerm('');
    setCurrentPage(1);

    // Delay a bit to ensure state updates propagate before fetching
    setTimeout(() => {
      fetchBattles(); // ✅ Force re-fetch so newly created battle appears
    }, 0);
  } else {
    setStatusFilter('all');
    setThemeFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
    await fetchBattles();
  }
};
 
  if (loading && battles.length === 0) {
    return (
      <>
        <Navbar /> {/* ✅ Add Navbar */}
        <LoadingSpinner />
      </>
    );
  }
 
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 lg:pt-23 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 flex items-center">
                <Sword className="w-12 h-12 mr-4 text-gray-700" />
                Story Battles
              </h1>
              <p className="text-gray-600 text-lg">Compete with other writers in themed challenges</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black px-8 py-4 rounded-xl transition-all duration-300 flex items-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Battle
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Active Battles */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-3 rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 font-medium">Active Battles</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {battles.filter(b => b.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-3 rounded-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 font-medium">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {battles.filter(b => b.status === 'upcoming').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Voting Phase */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 font-medium">Voting Phase</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {battles.filter(b => b.status === 'voting').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {battles.filter(b => b.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search battles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 placeholder-gray-500 shadow-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-4 bg-white/90 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 shadow-sm"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
                className="px-4 py-4 bg-white/90 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 shadow-sm"
              >
                <option value="all">All Themes</option>
                {themes.map(theme => (
                  <option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </option>
                ))}
              </select>

              <div className="flex items-center text-gray-700 px-4 bg-white/50 rounded-xl border border-gray-200">
                <Filter className="w-5 h-5 mr-3 text-gray-600" />
                <span className="font-medium">{battles.length} battles found</span>
              </div>
            </div>
          </div>

          {/* Battle Grid - Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 animate-pulse">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-6"></div>
                  <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {battles.map(battle => (
                  <BattleCard
                    key={battle._id}
                    battle={battle}
                    onJoin={handleJoinBattle}
                    onView={handleViewBattle}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg text-gray-700 font-medium transition-all duration-300"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg transform scale-105'
                          : 'bg-white/80 backdrop-blur-sm border border-gray-300 hover:bg-white hover:shadow-lg text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg text-gray-700 font-medium transition-all duration-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {battles.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
                <Trophy className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No battles found</h3>
              <p className="text-gray-600 mb-8 text-lg">Be the first to create an exciting story battle!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-10 py-4 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create Your First Battle
              </button>
            </div>
          )}

          {/* Create Battle Modal */}
          {showCreateModal && (
            <CreateBattleModal
              onClose={() => setShowCreateModal(false)}
              onBattleCreated={handleBattleCreated}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BattleDashboard;