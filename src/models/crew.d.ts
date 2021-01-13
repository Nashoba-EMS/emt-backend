import { ObjectID } from 'mongodb';

export interface CrewAssignment {
  _id: ObjectID;
  name: string;
  crews: Crew[];
}

export interface Crew {
  name: string;
  cadetIds: string[];
}

export type CrewAssignmentWithoutId = Omit<CrewAssignment, '_id'>;
