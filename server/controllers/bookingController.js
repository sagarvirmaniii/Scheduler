const prisma = require('../config/db');

const list = async (req, res) => {
  try {
    const { filter = 'upcoming' } = req.query;
    const now = new Date();

    // Get all event types for this user
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: req.user.id },
      select: { id: true },
    });
    const eventTypeIds = eventTypes.map((e) => e.id);

    const where = {
      eventTypeId: { in: eventTypeIds },
      ...(filter === 'upcoming'
        ? { startTime: { gte: now }, status: 'CONFIRMED' }
        : { OR: [{ startTime: { lt: now } }, { status: 'CANCELLED' }] }),
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: { eventType: { select: { title: true, duration: true, slug: true } } },
      orderBy: { startTime: filter === 'upcoming' ? 'asc' : 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { eventTypeId, guestName, guestEmail, startTime, timezone, notes } = req.body;
    if (!eventTypeId || !guestName || !guestEmail || !startTime) {
      return res.status(400).json({ error: 'eventTypeId, guestName, guestEmail, startTime required' });
    }

    const event = await prisma.eventType.findUnique({ where: { id: eventTypeId } });
    if (!event || !event.isActive) return res.status(404).json({ error: 'Event type not found' });

    const start = new Date(startTime);
    const end = new Date(start.getTime() + event.duration * 60 * 1000);

    const booking = await prisma.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          eventTypeId,
          status: 'CONFIRMED',
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });
      if (conflict) throw new Error('SLOT_TAKEN');

      return tx.booking.create({
        data: {
          title: `${event.title} with ${guestName}`,
          guestName,
          guestEmail,
          startTime: start,
          endTime: end,
          timezone: timezone || 'UTC',
          notes: notes || null,
          eventTypeId,
        },
      });
    });

    res.status(201).json(booking);
  } catch (err) {
    if (err.message === 'SLOT_TAKEN') return res.status(409).json({ error: 'This slot is already booked' });
    res.status(500).json({ error: err.message });
  }
};

const cancel = async (req, res) => {
  try {
    const { id } = req.params;

    const eventTypes = await prisma.eventType.findMany({
      where: { userId: req.user.id },
      select: { id: true },
    });
    const eventTypeIds = eventTypes.map((e) => e.id);

    const booking = await prisma.booking.findFirst({
      where: { id, eventTypeId: { in: eventTypeIds } },
    });
    if (!booking) return res.status(404).json({ error: 'Not found' });
    if (booking.status === 'CANCELLED') return res.status(400).json({ error: 'Already cancelled' });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { list, create, cancel };
