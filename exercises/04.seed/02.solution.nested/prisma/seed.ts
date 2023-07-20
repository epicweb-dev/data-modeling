import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'

const prisma = new PrismaClient()

await prisma.user.deleteMany()

await prisma.user.create({
	data: {
		email: 'kody@kcd.dev',
		username: 'kody',
		name: 'Kody',
		notes: {
			create: [
				{
					id: 'd27a197e',
					title: 'Basic Koala Facts',
					content:
						'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
					images: {
						create: [
							{
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
							{
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
						],
					},
				},
			],
		},
	},
})
