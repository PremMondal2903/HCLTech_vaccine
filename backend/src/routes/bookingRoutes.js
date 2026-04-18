/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Patient booking endpoints
 */
const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { bookingLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.use(protect, restrictTo('patient'));

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     tags: [Bookings]
 *     summary: Get my bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *       401:
 *         description: Unauthorized
 */
router.get('/my', bookingController.getMyBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get('/:id', bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create new booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hospitalId, vaccineId, slotDate, doseNumber]
 *             properties:
 *               hospitalId:
 *                 type: string
 *               vaccineId:
 *                 type: string
 *               slotDate:
 *                 type: string
 *                 format: date-time
 *               doseNumber:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  bookingLimiter,
  [
    body('hospitalId').notEmpty().withMessage('Hospital ID is required'),
    body('vaccineId').notEmpty().withMessage('Vaccine ID is required'),
    body('slotDate').isISO8601().toDate().withMessage('Slot date is required'),
    body('doseNumber').isInt({ min: 1 }).withMessage('Dose number is required'),
  ],
  bookingController.createBooking
);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     tags: [Bookings]
 *     summary: Reschedule booking
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
 *             required: [slotDate]
 *             properties:
 *               slotDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Booking rescheduled
 *       404:
 *         description: Booking not found
 */
router.put('/:id', [body('slotDate').isISO8601().toDate().withMessage('slotDate is required')], bookingController.rescheduleBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     tags: [Bookings]
 *     summary: Cancel booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/rebook:
 *   post:
 *     tags: [Bookings]
 *     summary: Quick rebook appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Rebooked successfully
 *       404:
 *         description: Booking not found
 */
router.post('/:id/rebook', bookingController.quickRebook);

module.exports = router;
