import { ObjectID } from 'mongodb';

export interface Schedule {
  _id: ObjectID;
  name: string;
  startDate: string;
  endDate: string;
  assignments: ScheduleDay[];
}

export interface ScheduleDay {
  date: string;
  cadet_ids: string[];
}

export type ScheduleWithoutId = Omit<Schedule, '_id'>;

/**
 * The availability of a given user in a given schedule
 */
export interface ScheduleAvailability {
  _id: ObjectID;
  schedule_id: string;
  user_id: string;
  days: string[];
}

export type ScheduleAvailabilityWithoutId = Omit<ScheduleAvailability, '_id'>;
