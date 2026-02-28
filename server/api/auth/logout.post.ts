import { deleteSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await deleteSession(event)
  return { success: true }
})
