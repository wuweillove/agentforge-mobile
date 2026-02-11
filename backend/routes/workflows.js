const express = require('express');
const Workflow = require('../models/Workflow');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../config/logger');

const router = express.Router();

// Get all workflows for user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const workflows = await Workflow.findByUserId(req.user.id, limit, offset);
    const count = await Workflow.countByUserId(req.user.id);
    
    res.json({
      workflows,
      count,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
});

// Get workflow by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const workflow = await Workflow.findById(req.params.id, req.user.id);
    
    if (!workflow) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workflow not found',
      });
    }
    
    res.json({ workflow });
  } catch (error) {
    next(error);
  }
});

// Create workflow
router.post('/', authenticate, validate(schemas.createWorkflow), async (req, res, next) => {
  try {
    const { name, description, nodes, connections, status } = req.body;
    
    // Check subscription limits
    const workflowCount = await Workflow.countByUserId(req.user.id);
    const tier = req.user.subscription_tier || 'free';
    
    const limits = {
      free: 3,
      premium: -1,
      enterprise: -1,
    };
    
    if (limits[tier] !== -1 && workflowCount >= limits[tier]) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Workflow limit reached for ${tier} tier`,
        limit: limits[tier],
        current: workflowCount,
      });
    }
    
    const workflow = await Workflow.create({
      userId: req.user.id,
      name,
      description,
      nodes,
      connections,
      status,
    });
    
    logger.info('Workflow created:', {
      userId: req.user.id,
      workflowId: workflow.id,
      name,
    });
    
    res.status(201).json({ workflow });
  } catch (error) {
    next(error);
  }
});

// Update workflow
router.put('/:id', authenticate, validate(schemas.updateWorkflow), async (req, res, next) => {
  try {
    const updates = req.body;
    const workflow = await Workflow.update(req.params.id, req.user.id, updates);
    
    if (!workflow) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workflow not found',
      });
    }
    
    logger.info('Workflow updated:', {
      userId: req.user.id,
      workflowId: workflow.id,
    });
    
    res.json({ workflow });
  } catch (error) {
    next(error);
  }
});

// Delete workflow
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const deleted = await Workflow.delete(req.params.id, req.user.id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workflow not found',
      });
    }
    
    logger.info('Workflow deleted:', {
      userId: req.user.id,
      workflowId: req.params.id,
    });
    
    res.json({
      message: 'Workflow deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
