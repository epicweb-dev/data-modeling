import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'

const prisma = new PrismaClient()

const newImage1 = await prisma.image.create({
	data: {
		altText: 'an adorable koala cartoon illustration',
		file: {
			create: {
				contentType: 'image/png',
				blob: await fs.promises.readFile(
					'./tests/fixtures/images/kody-notes/cute-koala.png',
				),
			},
		},
	},
})

const newImage2 = await prisma.image.create({
	data: {
		altText: 'a cartoon illustration of a koala in a tree eating',
		file: {
			create: {
				contentType: 'image/png',
				blob: await fs.promises.readFile(
					'./tests/fixtures/images/kody-notes/koala-eating.png',
				),
			},
		},
	},
})

const firstNote = await prisma.note.findFirst()

if (!firstNote) {
	throw new Error('You need to have a note in the database first')
}

await prisma.note.update({
	where: { id: firstNote.id },
	data: {
		images: {
			connect: [{ id: newImage1.id }, { id: newImage2.id }],
		},
	},
})
