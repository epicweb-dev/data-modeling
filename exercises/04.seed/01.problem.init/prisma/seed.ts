import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'

const prisma = new PrismaClient()

// 🐨 delete all users here:
// 💰 await prisma.user.deleteMany()
// 🦉 Thanks to the relationships we have configured in our schema, this will
// delete all the notes and images associated with the user as well.

// 🐨 create a new user with the following properties:
// email: 'kody@kcd.dev',
// username: 'kody',
// name: 'Kody',
// call the user variable you get back "kody"

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

// 🐨 instead of finding the first note, let's create it with these properties:
// id: 'd27a197e',
// title: 'Basic Koala Facts',
// content:
// 	'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
// ownerId: kody.id,
// you can call it "firstNote"

// 💣 we don't need this anymore:
const firstNote = await prisma.note.findFirst()

// 💣 we don't need this anymore
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
