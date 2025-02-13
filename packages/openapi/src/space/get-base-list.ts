import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import type { IGetBaseVo } from '../base';
import { getBaseVoSchema } from '../base';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const GET_BASE_LIST = '/space/{spaceId}/base';

export const getBaseListRoSchema = z.object({
  spaceId: z.string().optional(),
});

export type IGetBasesListRo = z.infer<typeof getBaseListRoSchema>;

export const GetBaseListRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_BASE_LIST,
  description: 'Get base list by query',
  request: {
    params: getBaseListRoSchema,
  },
  responses: {
    200: {
      description: 'Returns the list of base.',
      content: {
        'application/json': {
          schema: z.array(getBaseVoSchema),
        },
      },
    },
  },
  tags: ['base'],
});

export const getBaseList = async (query: IGetBasesListRo) => {
  return axios.get<IGetBaseVo[]>(urlBuilder(GET_BASE_LIST, query));
};
