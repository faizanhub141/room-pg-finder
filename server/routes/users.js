const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/favorites', protect, async (req, res, next) => {
  try { res.json((await User.findById(req.user._id).populate('favorites')).favorites); } catch (e) { next(e); }
});

router.post('/favorites/:listingId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.listingId;
    const has = user.favorites.some((f) => String(f) === id);
    user.favorites = has ? user.favorites.filter((f) => String(f) !== id) : [...user.favorites, id];
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (e) { next(e); }
});
module.exports = router;
