'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Zap, Trophy } from 'lucide-react';
import { formatDistanceToNow, differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

interface Battle {
  status: 'upcoming' | 'active' | 'voting' | 'completed';
  startTime: string;
  endTime: string;
  votingEndTime: string;
}

interface BattleTimerProps {
  battle: Battle;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const BattleTimer: React.FC<BattleTimerProps> = ({ battle }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'upcoming' | 'active' | 'voting' | 'completed'>(battle.status);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const startTime = new Date(battle.startTime);
      const endTime = new Date(battle.endTime);
      const votingEndTime = new Date(battle.votingEndTime);

      let targetTime: Date;
      let phase: 'upcoming' | 'active' | 'voting' | 'completed';

      // Determine current phase and target time
      if (now < startTime) {
        phase = 'upcoming';
        targetTime = startTime;
      } else if (now < endTime) {
        phase = 'active';
        targetTime = endTime;
      } else if (now < votingEndTime) {
        phase = 'voting';
        targetTime = votingEndTime;
      } else {
        phase = 'completed';
        targetTime = now; // No countdown needed
      }

      setCurrentPhase(phase);

      if (phase !== 'completed') {
        const totalSeconds = differenceInSeconds(targetTime, now);
        
        if (totalSeconds > 0) {
          const days = Math.floor(totalSeconds / (24 * 60 * 60));
          const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
          const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
          const seconds = totalSeconds % 60;

          setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            total: totalSeconds
          });
        } else {
          setTimeRemaining({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0
          });
        }
      } else {
        setTimeRemaining(null);
      }
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [battle.startTime, battle.endTime, battle.votingEndTime]);

  const getPhaseConfig = () => {
    switch (currentPhase) {
      case 'upcoming':
        return {
          icon: Calendar,
          title: 'Battle Starts In',
          description: 'Get ready to unleash your creativity!',
          color: 'blue',
          bgClass: 'bg-blue-50 border-blue-200',
          textClass: 'text-blue-900',
          iconClass: 'text-blue-600'
        };
      case 'active':
        return {
          icon: Zap,
          title: 'Submission Deadline',
          description: 'Battle is live! Submit your story now.',
          color: 'green',
          bgClass: 'bg-green-50 border-green-200',
          textClass: 'text-green-900',
          iconClass: 'text-green-600'
        };
      case 'voting':
        return {
          icon: Trophy,
          title: 'Voting Ends In',
          description: 'Vote for your favorite submissions!',
          color: 'yellow',
          bgClass: 'bg-yellow-50 border-yellow-200',
          textClass: 'text-yellow-900',
          iconClass: 'text-yellow-600'
        };
      default:
        return {
          icon: Trophy,
          title: 'Battle Completed',
          description: 'Check out the results!',
          color: 'purple',
          bgClass: 'bg-purple-50 border-purple-200',
          textClass: 'text-purple-900',
          iconClass: 'text-purple-600'
        };
    }
  };

  const config = getPhaseConfig();
  const Icon = config.icon;

  if (currentPhase === 'completed') {
    return (
      <div className={`${config.bgClass} border rounded-lg p-6`}>
        <div className="flex items-center justify-center">
          <Icon className={`w-8 h-8 ${config.iconClass} mr-3`} />
          <div className="text-center">
            <h3 className={`text-xl font-bold ${config.textClass}`}>{config.title}</h3>
            <p className={`text-sm ${config.textClass} opacity-80 mt-1`}>{config.description}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!timeRemaining) {
    return (
      <div className={`${config.bgClass} border rounded-lg p-6`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading timer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${config.bgClass} border rounded-lg p-6`}>
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Icon className={`w-6 h-6 ${config.iconClass} mr-2`} />
          <h3 className={`text-lg font-bold ${config.textClass}`}>{config.title}</h3>
        </div>
        <p className={`text-sm ${config.textClass} opacity-80`}>{config.description}</p>
      </div>

      {/* Countdown Display */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className={`bg-white rounded-lg p-3 shadow-sm border border-${config.color}-100`}>
            <div className={`text-2xl font-bold ${config.textClass}`}>
              {timeRemaining.days.toString().padStart(2, '0')}
            </div>
            <div className={`text-xs ${config.textClass} opacity-70 uppercase tracking-wide`}>
              Days
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`bg-white rounded-lg p-3 shadow-sm border border-${config.color}-100`}>
            <div className={`text-2xl font-bold ${config.textClass}`}>
              {timeRemaining.hours.toString().padStart(2, '0')}
            </div>
            <div className={`text-xs ${config.textClass} opacity-70 uppercase tracking-wide`}>
              Hours
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`bg-white rounded-lg p-3 shadow-sm border border-${config.color}-100`}>
            <div className={`text-2xl font-bold ${config.textClass}`}>
              {timeRemaining.minutes.toString().padStart(2, '0')}
            </div>
            <div className={`text-xs ${config.textClass} opacity-70 uppercase tracking-wide`}>
              Minutes
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`bg-white rounded-lg p-3 shadow-sm border border-${config.color}-100`}>
            <div className={`text-2xl font-bold ${config.textClass}`}>
              {timeRemaining.seconds.toString().padStart(2, '0')}
            </div>
            <div className={`text-xs ${config.textClass} opacity-70 uppercase tracking-wide`}>
              Seconds
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Started: {new Date(battle.startTime).toLocaleDateString()}</span>
          <span>
            {currentPhase === 'active' 
              ? `Ends: ${new Date(battle.endTime).toLocaleDateString()}`
              : `Voting Ends: ${new Date(battle.votingEndTime).toLocaleDateString()}`
            }
          </span>
        </div>
        
        <div className="w-full bg-white rounded-full h-2 shadow-inner">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 bg-gradient-to-r ${
              currentPhase === 'upcoming' 
                ? 'from-blue-400 to-blue-600'
                : currentPhase === 'active'
                ? 'from-green-400 to-green-600'
                : 'from-yellow-400 to-yellow-600'
            }`}
            style={{ 
              width: currentPhase === 'upcoming' ? '10%' : 
                     currentPhase === 'active' ? '50%' : '90%'
            }}
          ></div>
        </div>
      </div>

      {/* Urgency Warning */}
      {timeRemaining.total < 3600 && timeRemaining.total > 0 && ( // Less than 1 hour
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-sm text-red-800 font-medium">
              ⚠️ Less than 1 hour remaining!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleTimer;