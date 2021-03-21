import { ObjectID } from 'mongodb';

import { db } from '../middleware/mongoConnector';
import { ScheduleAvailability, ScheduleAvailabilityRawWithoutId } from './schedule.d';

/**
 * Get the Availability collection from Mongo
 */
const availabilityCollection = () => db?.collection<ScheduleAvailability>('availability');

/**
 * Get a list of availability by schedule or user ID
 */
export const getAvailabilityFor = async (searchOptions: { schedule_id?: ObjectID; user_id?: ObjectID }) => {
  try {
    const res = await availabilityCollection()?.find(searchOptions).toArray();

    return res ?? [];
  } catch (error) {
    return null;
  }
};

/**
 * Create a new availability
 */
export const createAvailability = async (availability: ScheduleAvailabilityRawWithoutId) => {
  try {
    const user_id = new ObjectID(availability.user_id);
    const schedule_id = new ObjectID(availability.schedule_id);

    const res = await availabilityCollection()?.findOneAndUpdate(
      {
        user_id,
        schedule_id
      },
      {
        $set: {
          ...availability,
          user_id,
          schedule_id
        }
      },
      {
        upsert: true,
        returnOriginal: false
      }
    );

    return res?.value ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Update a given availability
 */
export const updateAvailability = async (
  searchOptions: {
    schedule_id: ObjectID;
    user_id: ObjectID;
  },
  changes: {
    days: ScheduleAvailabilityRawWithoutId['days'];
  }
) => {
  try {
    const res = await availabilityCollection()?.findOneAndUpdate(
      searchOptions,
      {
        $set: changes
      },
      {
        returnOriginal: false
      }
    );

    return res?.value ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Delete availability if it exists
 */
export const deleteAvailability = async (searchOptions: { schedule_id?: ObjectID; user_id?: ObjectID }) => {
  try {
    await availabilityCollection()?.deleteMany(searchOptions);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
