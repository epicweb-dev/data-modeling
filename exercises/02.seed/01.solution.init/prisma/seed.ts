import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'

const prisma = new PrismaClient()

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await prisma.user.deleteMany()
	console.timeEnd('🧹 Cleaned up the database...')

	const kody = await prisma.user.create({
		data: {
			email: 'kody@kcd.dev',
			username: 'kody',
			name: 'Kody',
		},
	})

	const fileBlob = await fs.promises.readFile(
		'./tests/fixtures/images/kody-notes/cute-koala.png',
	)

	const newImage = await prisma.image.create({
		data: {
			altText: 'an adorable koala cartoon illustration',
			file: {
				create: { contentType: 'image/png', blob: fileBlob },
			},
		},
	})

	const firstNote = await prisma.note.create({
		data: {
			id: 'd27a197e',
			title: 'Basic Koala Facts',
			content:
				'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
			ownerId: kody.id,
		},
	})

	await prisma.note.update({
		where: { id: firstNote.id },
		data: {
			images: {
				connect: {
					id: newImage.id,
				},
			},
		},
	})

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
