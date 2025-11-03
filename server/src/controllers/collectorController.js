const Collector = require('../models/Collector');

exports.getAllCollectors = async (req, res) => {
  try {
    const collectors = await Collector.findAll();
    res.json(collectors);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching collectors' });
  }
};

exports.createCollector = async (req, res) => {
  const { name, mobile, address } = req.body;
  if (!name || !mobile || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newCollector = await Collector.create({ name, mobile, address });
    return res.status(201).json(newCollector);
  } catch (error) {
    console.error("Failed to create collector:", error);
    return res.status(500).json({ message: "Failed to create collector" });
  }
};