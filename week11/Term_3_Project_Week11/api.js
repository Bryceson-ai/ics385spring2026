// routes/api.js — Property CRUD endpoints
import express from 'express';
import Property from '../Property.js';

const router = express.Router();

function parseRatingFilter(minRatingQuery, maxRatingQuery) {
  const hasMin = minRatingQuery !== undefined;
  const hasMax = maxRatingQuery !== undefined;

  if (!hasMin && !hasMax) {
    return null;
  }

  const min = hasMin ? Number(minRatingQuery) : 1;
  const max = hasMax ? Number(maxRatingQuery) : 5;

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return { error: 'minRating and maxRating must be numbers.' };
  }

  if (min < 1 || max > 5 || min > max) {
    return { error: 'Ratings must be between 1 and 5, and minRating must be <= maxRating.' };
  }

  return { $gte: min, $lte: max };
}

// GET /properties — list properties, optional filters, and EJS render for browser views
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.island) {
      filter.island = req.query.island;
    }

    const ratingFilter = parseRatingFilter(req.query.minRating, req.query.maxRating);
    if (ratingFilter?.error) {
      return res.status(400).json({ error: ratingFilter.error });
    }

    if (ratingFilter) {
      filter['reviews.rating'] = ratingFilter;
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });

    const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
    if (acceptsHtml && req.query.format !== 'json') {
      return res.render('properties', { properties });
    }

    return res.json(properties);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /properties/:id — return one property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.json(property);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid property id' });
  }
});

// POST /properties/:id/reviews — append review to embedded reviews array
router.post('/:id/reviews', async (req, res) => {
  try {
    const { guestName, rating, comment } = req.body;

    if (!guestName || rating === undefined || !comment) {
      return res.status(400).json({
        error: 'guestName, rating (1-5), and comment are required.',
      });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'rating must be a number between 1 and 5.' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const review = {
      guestName,
      rating: numericRating,
      comment,
    };

    property.reviews.push(review);
    await property.save();

    return res.status(201).json({
      message: 'Review added successfully',
      review: property.reviews[property.reviews.length - 1],
      propertyId: property._id,
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid property id' });
  }
});

export default router;
