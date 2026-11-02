import mongoose from 'mongoose';

const experimentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  classLevel: { type: Number, required: true, enum: [6, 7, 8] },
  subject: { type: String, required: true, enum: ["Physics", "Chemistry", "Biology"] },
  summary: { type: String, required: true },
  steps: [{ type: String }],
  practical: {
    aim: { type: String },
    theory: { type: String },
    observations: [{ type: String }],
    result: { type: String },
    precautions: [{ type: String }],
    items: [[mongoose.Schema.Types.Mixed]], // Array of [id, name, optionalBoolean]
    sim: [[mongoose.Schema.Types.Mixed]]   // Array of simulation steps
  }
}, { timestamps: true });

export default mongoose.model('Experiment', experimentSchema);