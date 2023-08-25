import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'

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

// 💣 we don't need this anymore:
const firstNote = await prisma.note.findFirst()

if (!firstNote) {
	throw new Error('You need to have a note in the database first')
}

// 🐨 instead of finding the first note like we do above, let's swap "update"
// for "create" and add these properties:
// id: 'd27a197e',
// title: 'Basic Koala Facts',
// content:
// 	'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
// ownerId: kody.id,
await prisma.note.update({
	where: { id: firstNote.id },
	data: {
		images: {
			create: [
				{
					altText: 'an adorable koala cartoon illustration',
					contentType: 'image/png',
					blob: await fs.promises.readFile(
						'./tests/fixtures/images/kody-notes/cute-koala.png',
					),
				},
				{
					altText: 'a cartoon illustration of a koala in a tree eating',
					contentType: 'image/png',
					blob: await fs.promises.readFile(
						'./tests/fixtures/images/kody-notes/koala-eating.png',
					),
				},
			],
		},
	},
})
