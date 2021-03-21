import { ObjectID } from 'mongodb';

export interface Schedule {
  _id: ObjectID;
  name: string;
  startDate: string;
  endDate: string;
  editable: boolean;
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
  schedule_id: ObjectID;
  user_id: ObjectID;
  days: string[];
}

export type ScheduleAvailabilityRaw = Omit<ScheduleAvailability, '_id' | 'schedule_id' | 'user_id'> & {
  _id: string;
  schedule_id: string;
  user_id: string;
};

export type ScheduleAvailabilityWithoutId = Omit<ScheduleAvailability, '_id'>;
export type ScheduleAvailabilityRawWithoutId = Omit<ScheduleAvailabilityRaw, '_id'>;
