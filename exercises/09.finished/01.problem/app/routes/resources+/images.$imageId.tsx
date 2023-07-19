import { type DataFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server.ts'
import { invariantResponse } from '~/utils/misc.ts'

export async function loader({ params }: DataFunctionArgs) {
	invariantResponse(params.imageId, 'Image ID is required', { status: 400 })
	const image = await prisma.image.findUnique({
		where: { id: params.imageId },
		select: { contentType: true, file: { select: { blob: true } } },
	})

	invariantResponse(image?.file, 'Not found', { status: 404 })

	return new Response(image.file.blob, {
		headers: {
			'Content-Type': image.contentType,
			'Cache-Control': 'max-age=31536000',
		},
	})
}
