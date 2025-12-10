import fs from 'node:fs'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { promiseHash } from 'remix-utils/promise'

const prisma = new PrismaClient()

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()
	const username = faker.internet.userName({
		firstName: firstName.toLowerCase(),
		lastName: lastName.toLowerCase(),
	})
	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

async function img({
	altText,
	filepath,
}: {
	altText?: string
	filepath: string
}) {
	return {
		altText,
		contentType: filepath.endsWith('.png') ? 'image/png' : 'image/jpeg',
		blob: new Uint8Array(await fs.promises.readFile(filepath)),
	}
}

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	await prisma.user.deleteMany()
	console.timeEnd('🧹 Cleaned up the database...')

	const totalUsers = 5
	console.time(`👤 Created ${totalUsers} users...`)
	const noteImages = await Promise.all([
		img({
			altText: 'a nice country house',
			filepath: './tests/fixtures/images/notes/0.png',
		}),
		img({
			altText: 'a city scape',
			filepath: './tests/fixtures/images/notes/1.png',
		}),
		img({
			altText: 'a sunrise',
			filepath: './tests/fixtures/images/notes/2.png',
		}),
		img({
			altText: 'a group of friends',
			filepath: './tests/fixtures/images/notes/3.png',
		}),
		img({
			altText: 'friends being inclusive of someone who looks lonely',
			filepath: './tests/fixtures/images/notes/4.png',
		}),
		img({
			altText: 'an illustration of a hot air balloon',
			filepath: './tests/fixtures/images/notes/5.png',
		}),
		img({
			altText:
				'an office full of laptops and other office equipment that look like it was abandoned in a rush out of the building in an emergency years ago.',
			filepath: './tests/fixtures/images/notes/6.png',
		}),
		img({
			altText: 'a rusty lock',
			filepath: './tests/fixtures/images/notes/7.png',
		}),
		img({
			altText: 'something very happy in nature',
			filepath: './tests/fixtures/images/notes/8.png',
		}),
		img({
			altText: `someone at the end of a cry session who's starting to feel a little better.`,
			filepath: './tests/fixtures/images/notes/9.png',
		}),
	])

	const userImages = await Promise.all(
		Array.from({ length: 10 }, (_, index) =>
			img({ filepath: `./tests/fixtures/images/user/${index}.jpg` }),
		),
	)

	for (let index = 0; index < totalUsers; index++) {
		await prisma.user.create({
			data: {
				...createUser(),
				image: { create: userImages[index % 10] },
				notes: {
					create: Array.from({
						length: faker.number.int({ min: 1, max: 3 }),
					}).map(() => ({
						title: faker.lorem.sentence(),
						content: faker.lorem.paragraphs(),
						images: {
							create: Array.from({
								length: faker.number.int({ min: 1, max: 3 }),
							}).map(() => {
								const imgNumber = faker.number.int({ min: 0, max: 9 })
								return noteImages[imgNumber]
							}),
						},
					})),
				},
			},
		})
	}
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.time(`🐨 Created user "kody"`)

	const kodyImages = await promiseHash({
		kodyUser: img({ filepath: './tests/fixtures/images/user/kody.png' }),
		cuteKoala: img({
			altText: 'an adorable koala cartoon illustration',
			filepath: './tests/fixtures/images/kody-notes/cute-koala.png',
		}),
		koalaEating: img({
			altText: 'a cartoon illustration of a koala in a tree eating',
			filepath: './tests/fixtures/images/kody-notes/koala-eating.png',
		}),
		koalaCuddle: img({
			altText: 'a cartoon illustration of koalas cuddling',
			filepath: './tests/fixtures/images/kody-notes/koala-cuddle.png',
		}),
		mountain: img({
			altText: 'a beautiful mountain covered in snow',
			filepath: './tests/fixtures/images/kody-notes/mountain.png',
		}),
		koalaCoder: img({
			altText: 'a koala coding at the computer',
			filepath: './tests/fixtures/images/kody-notes/koala-coder.png',
		}),
		koalaMentor: img({
			altText:
				'a koala in a friendly and helpful posture. The Koala is standing next to and teaching a woman who is coding on a computer and shows positive signs of learning and understanding what is being explained.',
			filepath: './tests/fixtures/images/kody-notes/koala-mentor.png',
		}),
		koalaSoccer: img({
			altText: 'a cute cartoon koala kicking a soccer ball on a soccer field ',
			filepath: './tests/fixtures/images/kody-notes/koala-soccer.png',
		}),
	})

	await prisma.user.create({
		data: {
			email: 'kody@kcd.dev',
			username: 'kody',
			name: 'Kody',
			image: { create: kodyImages.kodyUser },
			notes: {
				create: [
					{
						id: 'd27a197e',
						title: 'Basic Koala Facts',
						content:
							'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
						images: { create: [kodyImages.cuteKoala, kodyImages.koalaEating] },
					},
				],
			},
		},
	})
	console.timeEnd(`🐨 Created user "kody"`)

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
