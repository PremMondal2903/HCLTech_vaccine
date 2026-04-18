/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin booking management endpoints
 */
const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     tags: [Admin]
 *     summary: Get all bookings (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         type: string
 *         enum: [pending, confirmed, completed, cancelled]
 *       - name: hospitalId
 *         in: query
 *         type: string
 *       - name: page
 *         in: query
 *         type: integer
 *       - name: limit
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: List of all bookings
 *       403:
 *         description: Admin access required
 */
router.get('/bookings', adminController.getAllBookings);

/**
 * @swagger
 * /api/admin/bookings/{id}/complete:
 *   put:
 *     tags: [Admin]
 *     summary: Mark booking as completed (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Booking marked as completed
 *       404:
 *         description: Booking not found
 *       403:
 *         description: Admin access required
 */
router.put('/bookings/:id/complete', adminController.completeBooking);

module.exports = router;
