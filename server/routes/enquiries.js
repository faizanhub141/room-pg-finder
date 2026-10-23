const router = require('express').Router();
const Enquiry = require('../models/Enquiry');
const Listing = require('../models/Listing');
const { protect, ownerOnly } = require('../middleware/auth');

router.post('/', protect, async (req, res, next) => {
  try {
    const { listing, message } = req.body;
    if (!listing || !message) return res.status(400).json({ message: 'Listing and message are required' });
    res.status(201).json(await Enquiry.create({ listing, message, user: req.user._id }));
  } catch (e) { next(e); }
});

router.get('/mine', protect, async (req, res, next) => {
  try { res.json(await Enquiry.find({ user: req.user._id }).populate('listing', 'title city').sort('-createdAt')); }
  catch (e) { next(e); }
});

router.get('/received', protect, ownerOnly, async (req, res, next) => {
  try {
    const ids = (await Listing.find({ owner: req.user._id }).select('_id')).map((l) => l._id);
    res.json(await Enquiry.find({ listing: { $in: ids } })
      .populate('listing', 'title').populate('user', 'name email phone').sort('-createdAt'));
  } catch (e) { next(e); }
});
module.exports = router;
