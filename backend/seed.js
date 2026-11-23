import mongoose from "mongoose";
import dotenv from "dotenv";

import { experiments } from "../frontend/src/data.js";
import { practicals } from "../frontend/src/practicals.js";

import Experiment from "./models/experiments.js";

dotenv.config();

const seedExperiments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const formattedExperiments = experiments.map((exp) => {
      const practical = practicals[exp.id];

      return {
        id: exp.id,
        title: exp.title,
        classLevel: exp.classLevel,
        subject: exp.subject,
        summary: exp.summary,
        steps: exp.steps,
        aim: practical?.aim || "",
        theory: practical?.theory || "",
        observations: practical?.observations || [],
        result: practical?.result || "",
        precautions: practical?.precautions || [],
        items: (practical?.items || []).map(([id, name, reuse]) => ({
          id,
          name,
          reuse: reuse || false,
        })),
        sim: (practical?.sim || []).map(([text, item, sound, result]) => ({
          text,
          item,
          sound,
          result,
        })),
      };
    });

    await Experiment.deleteMany({});
    await Experiment.insertMany(formattedExperiments);

    console.log("Experiments seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedExperiments();
