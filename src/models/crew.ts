import { ObjectID } from 'mongodb';

import { db } from '../middleware/mongoConnector';
import { CrewAssignment, CrewAssignmentWithoutId } from './crew.d';

/**
 * Get the Crew collection from Mongo
 */
const crewCollection = () => db?.collection<CrewAssignment>('crews');

/**
 * Get a list of all crews
 */
export const getAllCrews = async () => {
  try {
    const res = await crewCollection()?.find({}).toArray();

    return res ?? [];
  } catch (error) {
    return null;
  }
};

/**
 * Get a crew by ID
 */
export const getCrew = async (_id: string) => {
  try {
    const res = await crewCollection()?.findOne({
      _id: new ObjectID(_id)
    });

    return res ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Create a new crew
 */
export const createCrew = async (crew: CrewAssignmentWithoutId) => {
  try {
    const res = await crewCollection()?.insertOne(crew);

    return res?.ops[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Update a given crew if it exists
 */
export const updateCrew = async (_id: string, changes: Partial<CrewAssignment>) => {
  try {
    const res = await crewCollection()?.findOneAndUpdate(
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
 * Delete a given crew if it exists
 */
export const deleteCrew = async (_id: string) => {
  try {
    await crewCollection()?.deleteOne({
      _id: new ObjectID(_id)
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
