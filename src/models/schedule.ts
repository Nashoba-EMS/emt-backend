import { ObjectID } from 'mongodb';

import { db } from '../middleware/mongoConnector';
import { Schedule, ScheduleWithoutId } from './schedule.d';

/**
 * Get the Schedule collection from Mongo
 */
const scheduleCollection = () => db?.collection<Schedule>('schedules');

/**
 * Get a list of all schedules
 */
export const getAllSchedules = async () => {
  try {
    const res = await scheduleCollection()?.find({}).toArray();

    return res ?? [];
  } catch (error) {
    return null;
  }
};

/**
 * Get a schedule by ID
 */
export const getSchedule = async (_id: string) => {
  try {
    const res = await scheduleCollection()?.findOne({
      _id: new ObjectID(_id)
    });

    return res ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Create a new schedule
 */
export const createSchedule = async (schedule: ScheduleWithoutId) => {
  try {
    const res = await scheduleCollection()?.insertOne(schedule);

    return res?.ops[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Update a given schedule if it exists
 */
export const updateSchedule = async (_id: string, changes: Partial<ScheduleWithoutId>) => {
  try {
    const res = await scheduleCollection()?.findOneAndUpdate(
      {
        _id: new ObjectID(_id)
      },
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
 * Delete a given schedule if it exists
 */
export const deleteSchedule = async (_id: string) => {
  try {
    await scheduleCollection()?.deleteOne({
      _id: new ObjectID(_id)
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
