/**
 * Generate available time slots for a given date.
 * @param {object} params
 * @param {string} params.date - "YYYY-MM-DD"
 * @param {Array}  params.timeSlots - [{startTime:"HH:MM", endTime:"HH:MM"}]
 * @param {number} params.duration - minutes
 * @param {number} params.bufferTime - minutes
 * @param {Array}  params.existingBookings - [{startTime, endTime}]
 */
const generateSlots = ({ date, timeSlots, duration, bufferTime, existingBookings }) => {
  const slots = [];
  const now = new Date();
  const step = (duration + bufferTime) * 60 * 1000;

  for (const window of timeSlots) {
    // Parse as local time (no Z suffix) so 09:00 means 09:00 in server local time
    const windowStart = new Date(`${date}T${window.startTime}:00`);
    const windowEnd   = new Date(`${date}T${window.endTime}:00`);

    let cursor = windowStart.getTime();

    while (cursor + duration * 60 * 1000 <= windowEnd.getTime()) {
      const slotStart = new Date(cursor);
      const slotEnd   = new Date(cursor + duration * 60 * 1000);

      if (slotStart <= now) { cursor += step; continue; }

      const hasConflict = existingBookings.some((b) => {
        const bStart = new Date(b.startTime).getTime();
        const bEnd   = new Date(b.endTime).getTime();
        return slotStart.getTime() < bEnd && slotEnd.getTime() > bStart;
      });

      if (!hasConflict) {
        slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      }

      cursor += step;
    }
  }

  return slots;
};

module.exports = { generateSlots };
