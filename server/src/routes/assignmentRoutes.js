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


// POST GPS update from ESP32 - ✅ FIXED SCOPE + PERMANENT COVERAGE
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

    let previouslyCovered = []; // ✅ DECLARED HERE (outside if)
    let newlyCovered = [];     // ✅ DECLARED HERE

    // ✅ FIXED: PRESERVE PREVIOUSLY COVERED POINTS
    const route = await sequelize.models.Route.findByPk(assignment.routeId);
    if (route && route.points && Array.isArray(route.points)) {
      // Get EXISTING covered points (persistent)
      previouslyCovered = Array.isArray(assignment.coveredPoints) ? assignment.coveredPoints : [];
      
      // Find NEWLY covered points (20m precision)
      route.points.forEach((point, index) => {
        // Skip if already covered
        if (previouslyCovered.includes(index)) {
          console.log(`Point ${index + 1}: ✅ Already covered (permanent)`);
          return;
        }
        
        const distance = haversineDistance(
          parseFloat(lat), parseFloat(lng), 
          parseFloat(point.lat), parseFloat(point.lng)
        );
        
        console.log(`Point ${index + 1}: ${distance.toFixed(1)}m`);
        
        // ✅ 20m PRECISE radius
        if (distance <= 20) {
          newlyCovered.push(index);
          console.log(`✅ Point ${index + 1} NEWLY COVERED!`);
        }
      });
      
      // ✅ MERGE: previous + new (PERMANENT)
      const allCoveredPoints = [...new Set([...previouslyCovered, ...newlyCovered])];
      
      // Update
      assignment.coveredPoints = allCoveredPoints;
      assignment.pointsCovered = allCoveredPoints.length;
      
      console.log(`📊 Permanent coverage: [${previouslyCovered.join(', ')}] + [${newlyCovered.join(', ')}] = [${allCoveredPoints.join(', ')}] → ${assignment.pointsCovered}/${route.points.length}`);
      
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
      previouslyCovered: previouslyCovered.length,
      newlyCovered: newlyCovered.length,
      totalCovered: assignment.pointsCovered,
      coveredPoints: assignment.coveredPoints,
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
