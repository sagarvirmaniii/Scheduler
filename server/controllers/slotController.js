const prisma = require('../config/db');
const { generateSlots } = require('../services/slotService');

const getSlots = async (req, res) => {
  try {
    const { eventTypeId, date } = req.query;
    if (!eventTypeId || !date) return res.status(400).json({ error: 'eventTypeId and date required' });

    const event = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: { user: true },
    });
    if (!event || !event.isActive) return res.status(404).json({ error: 'Event type not found' });

    // date = "YYYY-MM-DD"
    const dateObj = new Date(date + 'T00:00:00Z');
    const dayOfWeek = dateObj.getUTCDay();

    const availDay = await prisma.availabilityDay.findUnique({
      where: { userId_dayOfWeek: { userId: event.userId, dayOfWeek } },
      include: { timeSlots: true },
    });

    if (!availDay || !availDay.isActive || availDay.timeSlots.length === 0) {
      return res.json([]);
    }

    const existingBookings = await prisma.booking.findMany({
      where: {
        eventTypeId,
        status: 'CONFIRMED',
        startTime: { gte: new Date(date + 'T00:00:00Z'), lt: new Date(date + 'T23:59:59Z') },
      },
    });

    const slots = generateSlots({
      date,
      timeSlots: availDay.timeSlots,
      duration: event.duration,
      bufferTime: event.bufferTime,
      existingBookings,
    });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSlots };
