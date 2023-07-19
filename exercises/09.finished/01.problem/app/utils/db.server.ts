import { PrismaClient } from '@prisma/client'
import { singleton } from './singleton.server.ts'

const prisma = singleton('prisma', () => {
	const p = new PrismaClient()
	p.$connect()
	return p
})

export { prisma }
