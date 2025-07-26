'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Clock, Trophy, Plus, Trash2, Award } from 'lucide-react';
import { createBattle } from '@/api/battle';
import type { Battle } from '@/api/battle';
import { createPortal } from 'react-dom';

interface CreateBattleModalProps {
  onClose: () => void;
  onBattleCreated: (newBattle: Battle) => void;
}

interface Prize {
  position: number;
  reward: string;
  points: number;
}

const CreateBattleModal: React.FC<CreateBattleModalProps> = ({ onClose, onBattleCreated }) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startTime: '',
    endTime: '',
    votingEndTime: '',
    maxParticipants: 10,
    battleType: 'story_battle'
  });
  
  // ✅ Add prizes state
  const [prizes, setPrizes] = useState<Prize[]>([
    { position: 1, reward: ' Gold Badge + Featured Story', points: 100 },
    { position: 2, reward: ' Silver Badge + Story Highlight', points: 75 },
    { position: 3, reward: ' Bronze Badge + Recognition', points: 50 }
  ]);

  const themes = ['horror', 'sci-fi', 'romance', 'fantasy', 'mystery', 'adventure', 'thriller', 'comedy'];

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Prize management functions
  const addPrize = () => {
    const newPosition = prizes.length + 1;
    setPrizes(prev => [...prev, {
      position: newPosition,
      reward: `Position ${newPosition} Prize`,
      points: Math.max(10, 60 - (newPosition - 1) * 10)
    }]);
  };

  const removePrize = (index: number) => {
    setPrizes(prev => prev.filter((_, i) => i !== index));
  };

  const updatePrize = (index: number, field: keyof Prize, value: string | number) => {
    setPrizes(prev => prev.map((prize, i) => 
      i === index ? { ...prize, [field]: value } : prize
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.theme || !formData.startTime || !formData.endTime || !formData.votingEndTime) {
      alert('Please fill in all required fields');
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    const votingEndTime = new Date(formData.votingEndTime);
    const now = new Date();

    if (startTime <= now) {
      alert('Start time must be in the future');
      return;
    }

    if (endTime <= startTime) {
      alert('End time must be after start time');
      return;
    }

    if (votingEndTime <= endTime) {
      alert('Voting end time must be after submission end time');
      return;
    }

    setLoading(true);
    
    try {
      // ✅ Include prizes in the request
      const battleData = {
        ...formData,
        maxParticipants: Number(formData.maxParticipants),
        prizes: prizes // Include prizes array
      };

      const response = await createBattle(battleData);
      
      if (response.success) {
        alert('Battle created successfully!');
        onBattleCreated(response.battle);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create battle';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Battle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Existing form fields... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Battle Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter battle title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Describe your battle..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme *
              </label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              >
                <option value="">Select theme...</option>
                {themes.map(theme => (
                  <option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </option>
                ))}
              </select>
            </div>
 <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Battle Type *
    </label>
    <select
      name="battleType"
      value={formData.battleType}
      onChange={handleChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
      required
    >
      <option value="story_battle">Story Battle</option>
      <option value="speed_write">Speed Writing</option>
      <option value="theme_based">Theme Based</option>
      <option value="continuation">Story Continuation</option>
      <option value="character_focus">Character Focus</option>
    </select>
  </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="2"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>

          {/* Time fields... */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission End *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting End *
              </label>
              <input
                type="datetime-local"
                name="votingEndTime"
                value={formData.votingEndTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>
          </div>

          {/* ✨ NEW: Prize Configuration Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-gray-600" />
                Prize Configuration
              </h3>
              <button
                type="button"
                onClick={addPrize}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prize
              </button>
            </div>

            <div className="space-y-4">
              {prizes.map((prize, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-gray-600 to-gray-800 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold">
                      {prize.position}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reward Description
                        </label>
                        <input
                          type="text"
                          value={prize.reward}
                          onChange={(e) => updatePrize(index, 'reward', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Describe the reward..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Points
                        </label>
                        <input
                          type="number"
                          value={prize.points}
                          onChange={(e) => updatePrize(index, 'points', parseInt(e.target.value) || 0)}
                          min="0"
                          max="1000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                    </div>

                    {prizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrize(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Award className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Prize Guidelines:</p>
                  <ul className="space-y-1">
                    <li>• Position 1 typically gets 100 points</li>
                    <li>• Position 2 typically gets 75 points</li>
                    <li>• Position 3 typically gets 50 points</li>
                    <li>• Lower positions get decreasing points (minimum 10)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-black transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Battle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CreateBattleModal;