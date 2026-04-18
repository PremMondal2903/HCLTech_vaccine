/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: Hospital search and management endpoints
 */
const express = require('express');
const { body } = require('express-validator');
const hospitalController = require('../controllers/hospitalController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/hospitals/search:
 *   get:
 *     tags: [Hospitals]
 *     summary: Search hospitals by filters
 *     parameters:
 *       - name: city
 *         in: query
 *         type: string
 *         description: Filter by city name
 *       - name: vaccineId
 *         in: query
 *         type: string
 *         description: Filter by vaccine ID
 *       - name: minPrice
 *         in: query
 *         type: number
 *       - name: maxPrice
 *         in: query
 *         type: number
 *       - name: date
 *         in: query
 *         type: string
 *         format: date
 *     responses:
 *       200:
 *         description: List of hospitals matching filters
 */
router.get('/search', hospitalController.searchHospitals);

/**
 * @swagger
 * /api/hospitals/nearby:
 *   get:
 *     tags: [Hospitals]
 *     summary: Find nearby hospitals by location
 *     parameters:
 *       - name: lat
 *         in: query
 *         type: number
 *         required: true
 *         description: Latitude
 *       - name: lng
 *         in: query
 *         type: number
 *         required: true
 *         description: Longitude
 *       - name: radius
 *         in: query
 *         type: number
 *         required: true
 *         description: Radius in meters
 *       - name: vaccineId
 *         in: query
 *         type: string
 *       - name: minPrice
 *         in: query
 *         type: number
 *       - name: maxPrice
 *         in: query
 *         type: number
 *     responses:
 *       200:
 *         description: List of nearby hospitals
 */
router.get('/nearby', hospitalController.getNearbyHospitals);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get hospital by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Hospital details
 *       404:
 *         description: Hospital not found
 */
router.get('/:id', hospitalController.getHospitalById);

/**
 * @swagger
 * /api/hospitals:
 *   post:
 *     tags: [Hospitals]
 *     summary: Create new hospital (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, city, pincode, state, phone, email]
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               state:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *               operatingHours:
 *                 type: object
 *     responses:
 *       201:
 *         description: Hospital created
 *       403:
 *         description: Admin access required
 */
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    body('name').notEmpty(),
    body('address').notEmpty(),
    body('city').notEmpty(),
    body('pincode').notEmpty(),
    body('state').notEmpty(),
    body('location.coordinates').isArray({ min: 2 }).withMessage('Location coordinates are required'),
    body('phone').notEmpty(),
    body('email').isEmail().withMessage('Valid email is required'),
    body('operatingHours.open').notEmpty(),
    body('operatingHours.close').notEmpty(),
  ],
  hospitalController.createHospital
);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   put:
 *     tags: [Hospitals]
 *     summary: Update hospital (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Hospital updated
 *       403:
 *         description: Admin access required
 */
router.put('/:id', protect, restrictTo('admin'), hospitalController.updateHospital);

/**
 * @swagger
 * /api/hospitals/{id}:
 *   delete:
 *     tags: [Hospitals]
 *     summary: Delete hospital (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Hospital deleted
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', protect, restrictTo('admin'), hospitalController.deleteHospital);

/**
 * @swagger
 * /api/hospitals/{id}/vaccines:
 *   post:
 *     tags: [Hospitals]
 *     summary: Add vaccine offering to hospital (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Vaccine added
 *       403:
 *         description: Admin access required
 */
router.post('/:id/vaccines', protect, restrictTo('admin'), hospitalController.addVaccineOffering);

/**
 * @swagger
 * /api/hospitals/{id}/vaccines/{vaccineId}:
 *   put:
 *     tags: [Hospitals]
 *     summary: Update vaccine price (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: vaccineId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Vaccine price updated
 */
router.put('/:id/vaccines/:vaccineId', protect, restrictTo('admin'), hospitalController.updateVaccinePrice);

/**
 * @swagger
 * /api/hospitals/{id}/vaccines/{vaccineId}/slots:
 *   post:
 *     tags: [Hospitals]
 *     summary: Set daily vaccine slots (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: vaccineId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Slots created
 */
router.post('/:id/vaccines/:vaccineId/slots', protect, restrictTo('admin'), hospitalController.setDailySlots);

/**
 * @swagger
 * /api/hospitals/{id}/vaccines/{vaccineId}/slots:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get slot calendar (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: vaccineId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Slot calendar
 */
router.get('/:id/vaccines/:vaccineId/slots', protect, restrictTo('admin'), hospitalController.getSlotCalendar);

module.exports = router;
