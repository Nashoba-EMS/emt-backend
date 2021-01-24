import { ObjectID } from 'mongodb';

export interface Schedule {
  _id: ObjectID;
  startDate: string;
  endDate: string;
  assignments: ScheduleDay[];
}

export interface ScheduleDay {
  date: string;
  cadetIds: string[];
}

export type ScheduleWithoutId = Omit<Schedule, '_id'>;
