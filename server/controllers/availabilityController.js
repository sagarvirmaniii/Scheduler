const prisma = require('../config/db');

const get = async (req, res) => {
  try {
    const days = await prisma.availabilityDay.findMany({
      where: { userId: req.user.id },
      include: { timeSlots: true },
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Full replace: body = [{ dayOfWeek, isActive, timeSlots: [{startTime, endTime}] }]
const upsert = async (req, res) => {
  try {
    const days = req.body;
    if (!Array.isArray(days)) return res.status(400).json({ error: 'Expected array' });

    const result = await prisma.$transaction(async (tx) => {
      const saved = [];
      for (const d of days) {
        const { dayOfWeek, isActive, timeSlots = [] } = d;
        if (dayOfWeek === undefined) continue;

        let day = await tx.availabilityDay.findUnique({
          where: { userId_dayOfWeek: { userId: req.user.id, dayOfWeek } },
        });

        if (day) {
          day = await tx.availabilityDay.update({
            where: { id: day.id },
            data: { isActive },
          });
          await tx.availabilityTimeSlot.deleteMany({ where: { availabilityDayId: day.id } });
        } else {
          day = await tx.availabilityDay.create({
            data: { userId: req.user.id, dayOfWeek, isActive },
          });
        }

        if (isActive && timeSlots.length > 0) {
          await tx.availabilityTimeSlot.createMany({
            data: timeSlots.map((s) => ({
              availabilityDayId: day.id,
              startTime: s.startTime,
              endTime: s.endTime,
            })),
          });
        }

        saved.push(
          await tx.availabilityDay.findUnique({
            where: { id: day.id },
            include: { timeSlots: true },
          })
        );
      }
      return saved;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPublic = async (req, res) => {
  try {
    const { slug } = req.params;
    const event = await prisma.eventType.findUnique({ where: { slug } });
    if (!event) return res.status(404).json({ error: 'Not found' });

    const days = await prisma.availabilityDay.findMany({
      where: { userId: event.userId, isActive: true },
      include: { timeSlots: true },
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { get, upsert, getPublic };
