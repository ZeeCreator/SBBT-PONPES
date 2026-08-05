export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('Generate report:', body)
  return { message: 'Report generation started', reportId: body.reportId }
})
