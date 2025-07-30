// server/src/routes/eventRoutes.ts
import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import authMiddleware from '../middleware/authMiddleware'; // Import auth middleware
import { AuthRequest } from '../types'; // Import your custom AuthRequest interface
import { format } from 'date-fns'; // For date formatting

const router = Router();

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (requires authentication)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, description, eventDate, eventTime, location } = req.body;
  const createdById = req.userId; // Get user ID from authenticated request

  // Basic validation
  if (!title || !eventDate || !eventTime || !location) {
    return res.status(400).json({ message: 'Please provide title, event date, event time, and location' });
  }

  if (!createdById) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  // Convert eventDate and eventTime to proper Date objects for Prisma
  // Assuming eventDate is YYYY-MM-DD and eventTime is HH:MM (or HH:MM:SS)
  // Prisma expects ISO 8601 strings or Date objects for DateTime fields.
  // For @db.Date and @db.Time, it's more about the internal storage type.
  // We'll pass Date objects, and Prisma handles conversion.
  const parsedEventDate = new Date(eventDate); // This will parse YYYY-MM-DD correctly
  const parsedEventTime = new Date(`1970-01-01T${eventTime}`); // Use a dummy date for time parsing

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: parsedEventDate,
        eventTime: parsedEventTime,
        location,
        createdById, // Link the event to the authenticated user
      },
    });

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
});


// @route   GET /api/events/my
// @desc    Get all events created by the authenticated user
// @access  Private
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response) => {
  const createdById = req.userId;

  if (!createdById) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const events = await prisma.event.findMany({
      where: { createdById },
      orderBy: {
        eventDate: 'asc', // Order by date ascending
      },
      // You can include the creator's email if needed:
      // include: {
      //   createdBy: {
      //     select: {
      //       email: true
      //     }
      //   }
      // }
    });

    // Optional: Format dates/times for consistent output (or handle in frontend)
    const formattedEvents = events.map(event => ({
      ...event,
      eventDate: format(new Date(event.eventDate), 'yyyy-MM-dd'),
      eventTime: format(new Date(event.eventTime), 'HH:mm'),
    }));


    res.status(200).json({ events: formattedEvents });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// @route   GET /api/events/:id
// @desc    Get a single event by ID (only if created by authenticated user)
// @access  Private
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const eventId = req.params.id;
  const createdById = req.userId;

  if (!createdById) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        createdBy: { // Include the creator's details
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure the event belongs to the authenticated user
    if (event.createdById !== createdById) {
      return res.status(403).json({ message: 'Not authorized to view this event' });
    }

    // Optional: Format dates/times
    const formattedEvent = {
      ...event,
      eventDate: format(new Date(event.eventDate), 'yyyy-MM-dd'),
      eventTime: format(new Date(event.eventTime), 'HH:mm'),
    };

    res.status(200).json({ event: formattedEvent });
  } catch (error) {
    console.error('Get single event error:', error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event (only if created by authenticated user)
// @access  Private
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const eventId = req.params.id;
  const createdById = req.userId;
  const { title, description, eventDate, eventTime, location } = req.body;

  if (!createdById) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  // Prepare update data, only include fields that are present
  const updateData: any = {};
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description; // Allow setting to null
  if (location) updateData.location = location;

  if (eventDate) {
    updateData.eventDate = new Date(eventDate);
  }
  if (eventTime) {
    updateData.eventTime = new Date(`1970-01-01T${eventTime}`);
  }

  try {
    // Find the event first to ensure it belongs to the user
    const eventToUpdate = await prisma.event.findUnique({
      where: { id: eventId },
      select: { createdById: true } // Only fetch the createdById for authorization check
    });

    if (!eventToUpdate) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (eventToUpdate.createdById !== createdById) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error updating event' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event (only if created by authenticated user)
// @access  Private
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const eventId = req.params.id;
  const createdById = req.userId;

  if (!createdById) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Find the event first to ensure it belongs to the user
    const eventToDelete = await prisma.event.findUnique({
      where: { id: eventId },
      select: { createdById: true }
    });

    if (!eventToDelete) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (eventToDelete.createdById !== createdById) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    res.status(200).json({ message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
});


export default router;