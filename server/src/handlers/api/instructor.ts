import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Topic } from '@prisma/client';
import { prisma } from '../../db';
import { Session } from '../../utils';

export type GetOwnTopicsResponse = Topic[];
export async function getOwnTopics(
  _: HttpRequest,
  context: InvocationContext,
  session: Session,
): Promise<HttpResponseInit> {
  if (!session.isInstructor) {
    context.warn('Unauthorized request');

    return {
      status: 401,
      body: 'UNAUTHORIZED_REQUEST',
    };
  }

  try {
    const topics = await prisma.topic.findMany({
      where: {
        instructorId: session.userId,
      },
    });

    return {
      jsonBody: [...topics] satisfies GetOwnTopicsResponse,
    };
  } catch (error) {
    context.error(error);

    return {
      status: 500,
    };
  }
}
