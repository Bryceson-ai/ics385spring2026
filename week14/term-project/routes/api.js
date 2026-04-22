// routes/api.js — Property CRUD endpoints
import express from 'express';
import Property from '../Property.js';

const router = express.Router();

// GET /api/properties — return all properties (optional island filter)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.island ? { island: req.query.island } : {};
    const properties = await Property.find(filter);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/properties/:id — return one property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
