import httpErrors from 'http-errors';

import middyfy from '../../middleware';
import { HTTPRawHandler } from '../handler';
import { createSchedule, deleteSchedule, getAllSchedules, getSchedule, updateSchedule } from '../../models/schedule';
import { Schedule } from '../../models/schedule.d';

/**
 * Manage schedules: CRUD
 */
const _handler: HTTPRawHandler<
  {
    action: 'GET' | 'CREATE' | 'UPDATE' | 'DELETE';
    targetId: string;
    schedulePayload: Partial<Schedule>;
  },
  {},
  {},
  {
    schedule: Schedule[] | Schedule;
  }
> = async (event) => {
  const { action, targetId, schedulePayload } = event.body;

  if (!(event.middleware.authorized && (event.middleware.user.admin || action === 'GET'))) {
    // User not authorized or attempting to edit and isn't an admin
    throw new httpErrors.Unauthorized('Not authorized');
  }

  if (!targetId && action !== 'GET' && action !== 'CREATE') {
    throw new httpErrors.BadRequest('No schedule specified');
  }

  switch (action) {
    case 'GET': {
      const schedules = await getAllSchedules();

      if (schedules === null) {
        throw new httpErrors.InternalServerError('Could not get schedules');
      }

      return {
        schedule: schedules
      };
    }
    case 'CREATE': {
      const createdSchedule = await createSchedule({
        name: schedulePayload.name ?? '',
        startDate: schedulePayload.startDate ?? '',
        endDate: schedulePayload.endDate ?? '',
        assignments: schedulePayload.assignments ?? []
      });

      if (!createdSchedule) {
        throw new httpErrors.InternalServerError('Failed to create schedule');
      }

      return {
        schedule: createdSchedule
      };
    }
    case 'UPDATE': {
      const updatedSchedule = await updateSchedule(targetId, schedulePayload);

      if (!updatedSchedule) {
        throw new httpErrors.InternalServerError('Failed to update schedule');
      }

      return {
        schedule: updatedSchedule
      };
    }
    case 'DELETE': {
      const targetSchedule = await getSchedule(targetId);

      if (!targetSchedule) {
        // Schedule does not exist
        throw new httpErrors.NotFound('Schedule does not exist');
      }

      const deletedSchedule = await deleteSchedule(targetId);

      if (!deletedSchedule) {
        throw new httpErrors.InternalServerError('Failed to delete schedule');
      }

      return {
        schedule: targetSchedule
      };
    }
    default: {
      throw new httpErrors.BadRequest('Invalid action');
    }
  }
};

export const handler = middyfy(_handler, {
  authorized: true,
  useMongo: true
});
