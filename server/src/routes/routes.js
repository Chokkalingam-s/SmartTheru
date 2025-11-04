const express = require('express');
const router = express.Router();
const { Route } = require('../models'); // Adjust path based on your setup

// GET all routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await Route.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// GET single route
router.get('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// POST create new route
router.post('/routes', async (req, res) => {
  try {
    const { name, points, totalPoints } = req.body;
    
    if (!name || !points || !Array.isArray(points)) {
      return res.status(400).json({ error: 'Invalid route data' });
    }

    const route = await Route.create({
      name,
      points,
      totalPoints: points.length
    });

    res.status(201).json(route);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Failed to create route' });
  }
});

// PUT update route
router.put('/routes/:id', async (req, res) => {
  try {
    const { name, points, totalPoints } = req.body;
    const route = await Route.findByPk(req.params.id);

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    await route.update({
      name,
      points,
      totalPoints: points.length
    });

    res.json(route);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Failed to update route' });
  }
});

// DELETE route
router.delete('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    await route.destroy();
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

module.exports = router;
