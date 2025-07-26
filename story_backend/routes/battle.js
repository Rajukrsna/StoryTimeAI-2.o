import express from 'express';
import StoryBattle from '../models/StoryBattle.js';
import BattleSubmission from '../models/BattleSubmission.js';
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

// Get all battles
router.get('/', async (req, res) => {
  try {
    const { status, theme, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {};

    if (status && status !== 'all') query.status = status;
    if (theme && theme !== 'all') query.theme = theme;
    if (search) query.title = { $regex: search, $options: 'i' };

    const battles = await StoryBattle.find(query)
      .populate('createdBy', 'name profilePicture')
      .populate('participants.user', 'name profilePicture')
      .populate('winner', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await StoryBattle.countDocuments(query);

    res.json({
      success: true,
      battles,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route after your "Get all battles" route
// Get single battle by ID
router.get('/:id', async (req, res) => {
  try {
    const battle = await StoryBattle.findById(req.params.id)
      .populate('createdBy', 'name profilePicture')
      .populate('participants.user', 'name profilePicture')
      .populate('winner', 'name profilePicture');

    if (!battle) {
      return res.status(404).json({ 
        success: false, 
        message: 'Battle not found' 
      });
    }

    res.json({
      success: true,
      battle
    });
  } catch (error) {
    console.error('Error fetching battle:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});
// Create new battle
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      theme,
      battleType,
      startTime,
      endTime, // in hours
      votingEndTime, // in hours
      maxParticipants,
      prizes
    } = req.body;

   

    const battle = new StoryBattle({
      title,
      description,
      theme,
      battleType,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      votingEndTime: new Date(votingEndTime),
      maxParticipants,
      prizes,
      createdBy: req.user._id
    });

    await battle.save();
    await battle.populate('createdBy', 'name profilePicture');

    res.status(201).json(
      {
        success: true,
        battle
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join battle
router.post('/:id/join', protect, async (req, res) => {
  try {
    console.log("entering join battle route with user:", req.user._id);
    const battle = await StoryBattle.findById(req.params.id);
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    if (battle.status !== 'upcoming') {
      return res.status(400).json({ message: 'Cannot join battle that has already started' });
    }

    if (battle.participants.length >= battle.maxParticipants) {
      return res.status(400).json({ message: 'Battle is full' });
    }

    const alreadyJoined = battle.participants.some(p => p.user.toString() === req.user._id.toString());
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this battle' });
    }

    const updatedBattle = await StoryBattle.findByIdAndUpdate(
      req.params.id,
      { $push: { participants: { user: req.user._id, joinedAt: new Date() } } },
      { new: true }
    ).populate('participants.user', 'name profilePicture');

    res.json({
      success: true,
      user: req.user._id, 
      message: 'Successfully joined battle', 
      battle: updatedBattle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit story for battle
router.post('/:id/submit', protect, async (req, res) => {
  try {

     console.log('🎯 Submit route hit');
    console.log('🎯 Battle ID:', req.params.id);
    console.log('🎯 User ID:', req.user._id);
    console.log('🎯 Request Body:', req.body);
    const { title, content } = req.body;
    const battle = await StoryBattle.findById(req.params.id);

    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    if (battle.status !== 'active') {
      return res.status(400).json({ message: 'Battle is not active' });
    }

    if (new Date() > battle.endTime) {
      return res.status(400).json({ message: 'Battle submission time has ended' });
    }

    const isParticipant = battle.participants.some(p => p.user.toString() === req.user._id.toString());
    console.log(isParticipant, "is participant check for user:", req.user._id);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant in this battle' });
    }

    // Check if user already submitted
    const existingSubmission = await BattleSubmission.findOne({
      battleId: req.params.id,
      author: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted for this battle' });
    }

    const wordCount = content.split(/\s+/).length;

    const submission = new BattleSubmission({
      battleId: req.params.id,
      author: req.user._id,
      title,
      content,
      wordCount,
      submittedAt: new Date()
    });

    await submission.save();

    const newSubmission = await BattleSubmission.findById(submission._id)
      .populate('author', 'name profilePicture');

    // Update battle participant with submission
    const participant = battle.participants.find(p => p.user.toString() === req.user._id.toString());
    participant.submission = submission._id;
    await battle.save();

    res.json({
      success: true,
      message: 'Story submitted successfully',
      submission: newSubmission, // ✅ Return the new submission
      battle: battle // ✅ Optionally return updated battle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vote for submission
router.post('/submissions/:id/vote', protect, async (req, res) => {
  try {
    const submission = await BattleSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const battle = await StoryBattle.findById(submission.battleId);
    if (battle.status !== 'voting') {
      return res.status(400).json({ message: 'Voting is not active for this battle' });
    }

    // Check if user already voted for this submission
    const alreadyVoted = submission.votes.some(v => v.user.toString() === req.user._id.toString());
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted for this submission' });
    }

    // Check if user is voting for their own submission
    if (submission.author.toString() === req.user._id) {
      return res.status(400).json({ message: 'Cannot vote for your own submission' });
    }

    const updatedSubmission = await BattleSubmission.findByIdAndUpdate(
      submission._id,
      { $push: { votes: { user: req.user._id } }, $inc: { totalVotes: 1 } },
      { new: true }
    );

    await StoryBattle.findByIdAndUpdate(
      battle._id,
      { $inc: { totalVotes: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      submission: updatedSubmission,
      battleTotalVotes: battle.totalVotes,
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get battle submissions
router.get('/:id/submissions', async (req, res) => {
  try {
    const battle = await StoryBattle.findById(req.params.id);
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    const  submissions = await BattleSubmission.find({ battleId: req.params.id })
      .populate('author', 'name profilePicture')
      .sort({ totalVotes: -1, submittedAt: 1 });

 res.json({
      success: true,
      submissions
    }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;