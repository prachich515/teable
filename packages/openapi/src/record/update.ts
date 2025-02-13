import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IRecord, IUpdateRecordRo } from '@teable/core';
import { recordSchema, updateRecordRoSchema } from '@teable/core';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const UPDATE_RECORD = '/table/{tableId}/record/{recordId}';

export const UpdateRecordRoute: RouteConfig = registerRoute({
  method: 'patch',
  path: UPDATE_RECORD,
  description: 'Update a record',
  request: {
    params: z.object({
      tableId: z.string(),
      recordId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateRecordRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Returns record data after update.',
      content: {
        'application/json': {
          schema: recordSchema,
        },
      },
    },
  },
  tags: ['record'],
});

export const updateRecord = async (
  tableId: string,
  recordId: string,
  recordRo: IUpdateRecordRo
) => {
  return axios.patch<IRecord>(
    urlBuilder(UPDATE_RECORD, {
      tableId,
      recordId,
    }),
    recordRo
  );
};
