const router = require('express').Router();
const Listing = require('../models/Listing');
const upload = require('../middleware/upload');
const { protect, ownerOnly } = require('../middleware/auth');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res, next) => {
  try {
    const { city, area, type, gender, minRent, maxRent, amenities, page = 1, limit = 9 } = req.query;
    const q = { available: true };
    if (city) q.city = new RegExp(esc(city), 'i');
    if (area) q.area = new RegExp(esc(area), 'i');
    if (type) q.type = type;
    if (gender) q.gender = { $in: [gender, 'unisex'] };
    if (minRent || maxRent) q.rent = { ...(minRent && { $gte: +minRent }), ...(maxRent && { $lte: +maxRent }) };
    if (amenities) q.amenities = { $all: amenities.split(',').filter(Boolean) };
    const total = await Listing.countDocuments(q);
    const listings = await Listing.find(q).sort('-createdAt')
      .skip((+page - 1) * +limit).limit(+limit).populate('owner', 'name');
    res.json({ listings, total, pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});

router.get('/mine', protect, ownerOnly, async (req, res, next) => {
  try { res.json(await Listing.find({ owner: req.user._id }).sort('-createdAt')); } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const l = await Listing.findById(req.params.id).populate('owner', 'name phone email');
    if (!l) return res.status(404).json({ message: 'Listing not found' });
    res.json(l);
  } catch (e) { next(e); }
});

const body = (b) => ({
  ...b,
  amenities: typeof b.amenities === 'string' ? b.amenities.split(',').filter(Boolean) : b.amenities,
});

router.post('/', protect, ownerOnly, upload.array('images', 5), async (req, res, next) => {
  try {
    const images = (req.files || []).map((f) => '/uploads/' + f.filename);
    res.status(201).json(await Listing.create({ ...body(req.body), images, owner: req.user._id }));
  } catch (e) { next(e); }
});

router.put('/:id', protect, ownerOnly, upload.array('images', 5), async (req, res, next) => {
  try {
    const l = await Listing.findById(req.params.id);
    if (!l) return res.status(404).json({ message: 'Listing not found' });
    if (String(l.owner) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'You can only edit your own listings' });
    Object.assign(l, body(req.body));
    if (req.files?.length) l.images = [...l.images, ...req.files.map((f) => '/uploads/' + f.filename)];
    res.json(await l.save());
  } catch (e) { next(e); }
});

router.delete('/:id', protect, ownerOnly, async (req, res, next) => {
  try {
    const l = await Listing.findById(req.params.id);
    if (!l) return res.status(404).json({ message: 'Listing not found' });
    if (String(l.owner) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'You can only delete your own listings' });
    await l.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (e) { next(e); }
});
module.exports = router;
