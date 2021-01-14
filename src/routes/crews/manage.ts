import httpErrors from 'http-errors';

import middyfy from '../../middleware';
import { HTTPRawHandler } from '../handler';
import { createCrew, deleteCrew, getAllCrews, getCrew, updateCrew } from '../../models/crew';
import { CrewAssignment } from '../../models/crew.d';

/**
 * Manage crews: CRUD
 */
const _handler: HTTPRawHandler<
  {
    action: 'GET' | 'CREATE' | 'UPDATE' | 'DELETE';
    targetId: string;
    crewPayload: Partial<CrewAssignment>;
  },
  {},
  {},
  {
    crewAssignment: CrewAssignment[] | CrewAssignment;
  }
> = async (event) => {
  const { action, targetId, crewPayload } = event.body;

  if (!(event.middleware.authorized && (event.middleware.user.admin || action === 'GET'))) {
    // User not authorized or attempting to edit and isn't an admin
    throw new httpErrors.Unauthorized('Not authorized');
  }

  if (!targetId && action !== 'GET' && action !== 'CREATE') {
    throw new httpErrors.BadRequest('No crew specified');
  }

  switch (action) {
    case 'GET': {
      const crews = await getAllCrews();

      if (!crews) {
        throw new httpErrors.InternalServerError('Could not get crews');
      }

      return {
        crewAssignment: crews
      };
    }
    case 'CREATE': {
      const createdCrew = await createCrew({
        name: crewPayload.name ?? '',
        crews: crewPayload.crews ?? []
      });

      if (!createdCrew) {
        throw new httpErrors.InternalServerError('Failed to create crew');
      }

      return {
        crewAssignment: createdCrew
      };
    }
    case 'UPDATE': {
      const updatedCrew = await updateCrew(targetId, crewPayload);

      if (!updatedCrew) {
        throw new httpErrors.InternalServerError('Failed to update crew');
      }

      return {
        crewAssignment: updatedCrew
      };
    }
    case 'DELETE': {
      const targetCrew = await getCrew(targetId);

      if (!targetCrew) {
        // Crew does not exist
        throw new httpErrors.NotFound('Crew does not exist');
      }

      const deletedCrew = await deleteCrew(targetId);

      if (!deletedCrew) {
        throw new httpErrors.InternalServerError('Failed to delete crew');
      }

      return {
        crewAssignment: targetCrew
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
