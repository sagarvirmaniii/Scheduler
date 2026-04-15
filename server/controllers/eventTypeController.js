const prisma = require('../config/db');
const { slugify } = require('../utils/slugify');

const list = async (req, res) => {
  try {
    const events = await prisma.eventType.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, duration, bufferTime } = req.body;
    if (!title || !duration) return res.status(400).json({ error: 'title and duration required' });

    const slug = slugify(title) + '-' + Date.now().toString(36);
    const event = await prisma.eventType.create({
      data: {
        title,
        description: description || null,
        duration: parseInt(duration),
        bufferTime: parseInt(bufferTime) || 0,
        slug,
        userId: req.user.id,
      },
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.eventType.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { title, description, duration, bufferTime, isActive } = req.body;
    const event = await prisma.eventType.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(bufferTime !== undefined && { bufferTime: parseInt(bufferTime) }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.eventType.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    await prisma.eventType.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBySlug = async (req, res) => {
  try {
    const event = await prisma.eventType.findUnique({
      where: { slug: req.params.slug },
      include: { user: { select: { name: true, username: true, timezone: true } } },
    });
    if (!event || !event.isActive) return res.status(404).json({ error: 'Not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getByUsername = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: { id: true, name: true, username: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const events = await prisma.eventType.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ user, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { list, create, update, remove, getBySlug, getByUsername };
