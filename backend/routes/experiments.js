import express from 'express';
import Experiment from '../models/experiments.js';

const router = express.Router();

// GET all experiments (with optional query filters like ?classLevel=7&subject=Physics)
router.get('/', async (req, res) => {
  try {
    const { classLevel, subject } = req.query;
    let filter = {};

    if (classLevel) {
      filter.classLevel = Number(classLevel);
    }
    if (subject) {
      filter.subject = subject;
    }

    const experiments = await Experiment.find(filter).sort({ id: 1 });
    res.json(experiments);
  } catch (err) {
    console.error("Error fetching experiments:", err);
    res.status(500).json({ error: "Server error while fetching experiments." });
  }
});

// GET a single experiment by ID
router.get('/:id', async (req, res) => {
  try {
    const experimentId = Number(req.params.id);
    const experiment = await Experiment.findOne({ id: experimentId });

    if (!experiment) {
      return res.status(404).json({ error: "Experiment not found." });
    }

    res.json(experiment);
  } catch (err) {
    console.error("Error fetching experiment detail:", err);
    res.status(500).json({ error: "Server error while fetching experiment." });
  }
});

export default router;