import mongoose from 'mongoose';
const storyBattleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true,
    enum: ['horror', 'sci-fi', 'romance', 'fantasy', 'mystery', 'adventure', 'thriller', 'comedy']
  },
  battleType: {
    type: String,
    enum: ['speed_write', 'theme_based', 'continuation', 'character_focus'],
    default: 'theme_based'
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'voting', 'completed'],
    default: 'upcoming'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  votingEndTime: {
    type: Date,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: 10
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BattleSubmission'
    }
  }],
  prizes: [{
    position: Number,
    reward: String,
    points: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  totalVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const StoryBattle = mongoose.model('StoryBattle', storyBattleSchema);
export default StoryBattle;