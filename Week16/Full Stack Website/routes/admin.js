const express = require('express');
const { body, validationResult } = require('express-validator');
const ensureAuth = require('../middleware/ensureAuth');
const ensureAdmin = require('../middleware/ensureAdmin');
const propertyStore = require('../lib/propertyStore');

const router = express.Router();

const propertyValidators = [
  body('name').trim().isLength({ min: 3, max: 80 }).withMessage('Name must be 3-80 characters.').escape(),
  body('island').trim().isIn(['Maui', "O'ahu", "Kaua'i", 'Hawaii Island', 'Molokai', 'Lanai']).withMessage('Choose a valid island.'),
  body('type').trim().isIn(['hotel', 'vacation rental']).withMessage('Choose a valid property type.'),
  body('description').trim().isLength({ min: 20, max: 500 }).withMessage('Description must be 20-500 characters.').escape(),
  body('amenities').trim().isLength({ min: 3 }).withMessage('Enter at least one amenity.').escape(),
  body('targetSegment').trim().isLength({ min: 3, max: 80 }).withMessage('Target segment is required.').escape(),
  body('imageURL').trim().isURL().withMessage('Enter a valid image URL.')
];

router.use('/admin', ensureAuth, ensureAdmin);

router.get('/admin/dashboard', async (req, res, next) => {
  try {
    const properties = await propertyStore.listProperties();
    const totalReviews = properties.reduce((sum, property) => sum + (property.reviews?.length || 0), 0);

    res.render('admin', {
      pageTitle: 'Admin Dashboard',
      properties,
      totalReviews,
      created: req.query.created === '1'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/properties/new', (req, res) => {
  res.render('property-new', {
    pageTitle: 'Add Property',
    errors: [],
    formData: {}
  });
});

router.post('/admin/properties', propertyValidators, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('property-new', {
      pageTitle: 'Add Property',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    await propertyStore.createProperty(req.body);
    res.redirect('/admin/dashboard?created=1');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
