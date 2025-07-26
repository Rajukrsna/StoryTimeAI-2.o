import mongoose from 'mongoose';
const battleSubmissionSchema = new mongoose.Schema({
  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoryBattle',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000 // Limit for battle submissions
  },
  wordCount: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalVotes: {
    type: Number,
    default: 0
  },
  ranking: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const BattleSubmission = mongoose.model('BattleSubmission', battleSubmissionSchema);
export default BattleSubmission;