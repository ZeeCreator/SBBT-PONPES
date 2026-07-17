import { rtdbUpdate } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  await rtdbUpdate('academicYears', id, body)
  return { id, ...body }
})
