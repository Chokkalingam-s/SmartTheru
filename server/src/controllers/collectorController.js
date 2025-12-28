const { sequelize } = require('../config/config'); // Direct sequelize access

exports.getAllCollectors = async (req, res) => {
  try {
    const collectors = await sequelize.models.Collector.findAll({
      attributes: ['id', 'name', 'mobile', 'address']
    });
    res.json(collectors);
  } catch (error) {
    console.error('Collectors fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch collectors', details: error.message });
  }
};

exports.createCollector = async (req, res) => {
  const { name, mobile, address } = req.body;
  
  if (!name || !mobile) {
    return res.status(400).json({ message: "Name and mobile are required" });
  }
  
  try {
    const newCollector = await sequelize.models.Collector.create({ 
      name, 
      mobile, 
      address: address || null 
    });
    res.status(201).json(newCollector);
  } catch (error) {
    console.error("Create collector error:", error);
    res.status(500).json({ message: "Failed to create collector", details: error.message });
  }
};
