import { ObjectID } from 'mongodb';

import { db } from '../middleware/mongoConnector';
import { ScheduleAvailability, ScheduleAvailabilityRawWithoutId, ScheduleAvailabilityWithoutId } from './schedule.d';

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
export const createAvailability = async (availability: ScheduleAvailabilityWithoutId) => {
  try {
    const res = await availabilityCollection()?.findOneAndUpdate(
      {
        user_id: availability.user_id,
        schedule_id: availability.schedule_id
      },
      {
        $set: availability
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
