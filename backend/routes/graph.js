import express from "express";
import mongoose from "mongoose";
import Graph from "../models/Graph.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// SAVE GRAPH
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, points, precisionStep, xLabel, yLabel, xScale, yScale } =
      req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "Graph title is required.",
      });
    }

    if (
      !Array.isArray(points) ||
      !points.every((p) => Number.isFinite(p?.x) && Number.isFinite(p?.y))
    ) {
      return res.status(400).json({
        error: "Invalid graph points.",
      });
    }

    const scales = [xScale, yScale];

    if (
      scales.some(
        (v) =>
          v !== undefined && (!Number.isFinite(Number(v)) || Number(v) <= 0),
      )
    ) {
      return res.status(400).json({
        error: "Invalid graph scales.",
      });
    }

    const graph = await Graph.create({
      student: req.user.userId,
      title,
      points,
      precisionStep,
      xLabel,
      yLabel,
      xScale,
      yScale,
    });

    res.status(201).json(graph);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Could not save graph.",
    });
  }
});

// GET ALL GRAPHS OF LOGGED-IN STUDENT
router.get("/", authMiddleware, async (req, res) => {
  try {
    const graphs = await Graph.find({
      student: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(graphs);
  } catch (error) {
    res.status(500).json({
      error: "Could not fetch graphs.",
    });
  }
});

// GET ONE GRAPH (ONLY ITS OWNER)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: "Invalid graph ID.",
      });
    }

    const graph = await Graph.findOne({
      _id: req.params.id,
      student: req.user.userId,
    });

    if (!graph) {
      return res.status(404).json({
        error: "Graph not found.",
      });
    }

    res.json(graph);
  } catch (error) {
    res.status(500).json({
      error: "Could not load graph.",
    });
  }
});

export default router;
