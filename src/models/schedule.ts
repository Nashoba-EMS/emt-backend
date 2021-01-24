import { ObjectID } from 'mongodb';

import { db } from '../middleware/mongoConnector';
import { Schedule, ScheduleDay } from './schedule.d';

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
