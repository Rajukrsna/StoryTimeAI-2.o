import StoryBattle from '../models/StoryBattle.js';
import BattleSubmission from '../models/BattleSubmission.js';
import User from '../models/User.js';

class BattleService {
  static async updateBattleStatuses() {
    const now = new Date();
    
    try {
      // Start upcoming battles
      await StoryBattle.updateMany(
        { status: 'upcoming', startTime: { $lte: now } },
        { status: 'active' }
      );

      // Move active battles to voting phase
      await StoryBattle.updateMany(
        { status: 'active', endTime: { $lte: now } },
        { status: 'voting' }
      );

      // Complete voting battles
      const battlesToComplete = await StoryBattle.find({
        status: 'voting',
        votingEndTime: { $lte: now }
      });

      for (const battle of battlesToComplete) {
        await this.completeBattle(battle._id);
      }

      console.log('Battle statuses updated successfully');
    } catch (error) {
      console.error('Error updating battle statuses:', error);
    }
  }

  static async completeBattle(battleId) {
    try {
      const submissions = await BattleSubmission.find({ battleId })
        .populate('author')
        .sort({ totalVotes: -1, submittedAt: 1 });

      if (submissions.length > 0) {
        const winner = submissions[0];
        
        // Update rankings
        submissions.forEach((submission, index) => {
          submission.ranking = index + 1;
          submission.save();
        });

        // Award points to participants
        for (let i = 0; i < submissions.length; i++) {
          const points = this.calculatePoints(i + 1, submissions.length);
          await User.findByIdAndUpdate(
            submissions[i].author._id,
            { $inc: { battlePoints: points } }
          );
        }

        // Update battle with winner
        await StoryBattle.findByIdAndUpdate(battleId, {
          status: 'completed',
          winner: winner.author._id
        });
      }
    } catch (error) {
      console.error('Error completing battle:', error);
    }
  }

  static calculatePoints(rank, totalParticipants) {
    const basePoints = {
      1: 100,
      2: 75,
      3: 50
    };
    
    if (rank <= 3) {
      return basePoints[rank];
    }
    
    return Math.max(10, 50 - (rank - 3) * 5);
  }
}

export default BattleService;