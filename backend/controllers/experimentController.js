import Experiment from "../models/experiments.js";

export const getExperiments = async (req, res) => {
  try {
    const { classLevel, subject, search } = req.query;

    const filter = {};

    if (classLevel) {
      filter.classLevel = Number(classLevel);
    }

    if (subject) {
      filter.subject = subject;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const experiments = await Experiment.find(filter).select(
      "id title classLevel subject summary steps",
    );

    res.status(200).json(experiments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExperimentById = async (req, res) => {
  try {
    const experiment = await Experiment.findOne({
      id: Number(req.params.id),
    });

    if (!experiment) {
      return res.status(404).json({
        message: "Experiment not found",
      });
    }

    res.status(200).json(experiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
