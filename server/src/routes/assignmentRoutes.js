const express = require('express');
const { sequelize } = require('../config/config');
const { RouteAssignment } = require('../models/route_assignments');
const router = express.Router();

// GET all collectors
router.get('/collectors', async (req, res) => {
  try {
    const collectors = await sequelize.models.Collector.findAll({
      attributes: ['id', 'name', 'mobile', 'address']
    });
    res.json(collectors);
  } catch (error) {
    console.error('Collectors error:', error);
    res.status(500).json({ error: 'Failed to fetch collectors', details: error.message });
  }
});

// GET all routes
router.get('/available-routes', async (req, res) => {
  try {
    const routes = await sequelize.models.Route.findAll({
      attributes: ['id', 'name', 'points', 'totalPoints']
    });
    res.json(routes);
  } catch (error) {
    console.error('Routes error:', error);
    res.status(500).json({ error: 'Failed to fetch routes', details: error.message });
  }
});

// POST assign route
router.post('/assign', async (req, res) => {
  try {
    const { collectorId, routeId, totalPoints } = req.body;
    
    const assignment = await sequelize.models.RouteAssignment.create({
      collectorId: parseInt(collectorId),
      routeId: parseInt(routeId),
      totalPoints: parseInt(totalPoints)
    });
    
    res.json(assignment);
  } catch (error) {
    console.error('Assign error:', error);
    res.status(500).json({ error: 'Failed to assign route', details: error.message });
  }
});

// GET assignments
// GET assignments - FIXED to include route.points!
router.get('/', async (req, res) => {
  try {
    const assignments = await sequelize.models.RouteAssignment.findAll({
      include: [
        { 
          model: sequelize.models.Collector, 
          attributes: ['name', 'mobile'],
          as: 'collector'
        },
        { 
          model: sequelize.models.Route, 
          attributes: ['name', 'totalPoints', 'points'],  // ✅ ADD 'points' HERE
          as: 'route'
        }
      ]
    });
    console.log("📤 Assignments with points:", assignments.length);
    res.json(assignments);
  } catch (error) {
    console.error('Assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments', details: error.message });
  }
});


// POST GPS update from ESP32 - ✅ TRACKS EXACT POINTS
router.post('/gps-update/:assignmentId', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const assignmentId = parseInt(req.params.assignmentId);
    
    const assignment = await sequelize.models.RouteAssignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Update current location
    assignment.currentLat = parseFloat(lat);
    assignment.currentLng = parseFloat(lng);
    assignment.lastUpdated = new Date();

    // ✅ FIXED: Track EXACT covered points
    const route = await sequelize.models.Route.findByPk(assignment.routeId);
    if (route && route.points && Array.isArray(route.points)) {
      const coveredPointIndices = []; // [0, 2, 4]
      
      // Check distance to EACH point
      route.points.forEach((point, index) => {
        const distance = haversineDistance(
          parseFloat(lat), parseFloat(lng), 
          parseFloat(point.lat), parseFloat(point.lng)
        );
        
        console.log(`Point ${index + 1}: ${distance.toFixed(1)}m`);
        
        if (distance <= 50) { // 50 meters
          coveredPointIndices.push(index); // Track EXACT index
        }
      });
      
      // Update covered points array & count
      assignment.coveredPoints = coveredPointIndices;
      assignment.pointsCovered = coveredPointIndices.length;
      
      console.log(`📊 Covered points: [${coveredPointIndices.join(', ')}] → ${assignment.pointsCovered}/${route.points.length}`);
      
      // Update status
      if (assignment.pointsCovered >= assignment.totalPoints) {
        assignment.status = 'completed';
      } else {
        assignment.status = 'in_progress';
      }
    }

    await assignment.save();
    res.json({ 
      success: true, 
      coveredPoints: assignment.coveredPoints,
      pointsCovered: assignment.pointsCovered,
      totalPoints: assignment.totalPoints
    });
  } catch (error) {
    console.error('GPS update error:', error);
    res.status(500).json({ error: error.message });
  }
});



// Haversine distance function
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

module.exports = router;
