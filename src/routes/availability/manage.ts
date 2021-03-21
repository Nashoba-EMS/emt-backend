import httpErrors from 'http-errors';
import { ObjectID } from 'mongodb';

import middyfy from '../../middleware';
import { HTTPRawHandler } from '../handler';
import { ScheduleAvailability, ScheduleAvailabilityRaw } from '../../models/schedule.d';
import {
  createAvailability,
  deleteAvailability,
  getAvailabilityFor,
  updateAvailability
} from '../../models/availability';

/**
 * Manage availability: CRUD
 */
const _handler: HTTPRawHandler<
  {
    action: 'GET' | 'CREATE' | 'UPDATE' | 'DELETE';
    schedule_id?: string;
    user_id?: string;
    availabilityPayload: Partial<ScheduleAvailabilityRaw>;
  },
  {},
  {},
  {
    availability: ScheduleAvailability[] | ScheduleAvailability;
  }
> = async (event) => {
  const { action, schedule_id, user_id, availabilityPayload } = event.body;

  const searchOptions: {
    schedule_id?: ObjectID;
    user_id?: ObjectID;
  } = {};

  if (schedule_id) {
    searchOptions.schedule_id = new ObjectID(schedule_id);
  }

  if (user_id) {
    searchOptions.user_id = new ObjectID(user_id);
  }

  if (
    !(
      event.middleware.authorized &&
      (event.middleware.user.admin || event.middleware.user._id.equals(searchOptions.user_id ?? ''))
    )
  ) {
    // User not authorized or attempting to edit another user and isn't an admin
    throw new httpErrors.Unauthorized('Not authorized');
  }

  if (!searchOptions.schedule_id && !searchOptions.user_id) {
    throw new httpErrors.BadRequest('No user or schedule specified');
  }

  switch (action) {
    case 'GET': {
      const availability = await getAvailabilityFor(searchOptions);

      if (availability === null) {
        throw new httpErrors.InternalServerError('Could not get availability');
      }

      return {
        availability
      };
    }
    case 'CREATE': {
      if (!searchOptions.schedule_id || !searchOptions.user_id) {
        throw new httpErrors.BadRequest('Missing required data');
      }

      const createdAvailability = await createAvailability({
        schedule_id: searchOptions.schedule_id,
        user_id: searchOptions.user_id,
        days: availabilityPayload.days ?? []
      });

      if (!createdAvailability) {
        throw new httpErrors.InternalServerError('Failed to create availability');
      }

      return {
        availability: createdAvailability
      };
    }
    case 'UPDATE': {
      if (!searchOptions.schedule_id || !searchOptions.user_id) {
        throw new httpErrors.BadRequest('Missing required data');
      }

      const updatedAvailability = await updateAvailability(searchOptions as Required<typeof searchOptions>, {
        days: availabilityPayload.days ?? []
      });

      if (!updatedAvailability) {
        throw new httpErrors.InternalServerError('Failed to update availability');
      }

      return {
        availability: updatedAvailability
      };
    }
    case 'DELETE': {
      if (!searchOptions.schedule_id || !searchOptions.user_id) {
        throw new httpErrors.BadRequest('Missing required data');
      }

      const targetedAvailability = await getAvailabilityFor(searchOptions);

      if (!targetedAvailability || targetedAvailability.length === 0) {
        throw new httpErrors.NotFound('Availability does not exist');
      }

      const deletedAvailability = await deleteAvailability(searchOptions);

      if (!deletedAvailability) {
        throw new httpErrors.InternalServerError('Failed to delete availability');
      }

      return {
        availability: targetedAvailability[0]
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
