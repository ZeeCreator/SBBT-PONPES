import { d as defineEventHandler, e as getRouterParams } from '../../../../../../_/nitro.mjs';
import { b as rtdbRemove } from '../../../../../../_/firebase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
import 'firebase-admin/database';
import 'jose';

const _roomId__delete = defineEventHandler(async (event) => {
  const { id, roomId } = getRouterParams(event);
  await rtdbRemove(`dormitories/${id}/rooms`, roomId);
  return { success: true };
});

export { _roomId__delete as default };
//# sourceMappingURL=_roomId_.delete.mjs.map
