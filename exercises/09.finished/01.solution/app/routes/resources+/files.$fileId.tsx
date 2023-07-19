import { type DataFunctionArgs } from '@remix-run/node'
import { prisma } from '~/utils/db.server.ts'
import { invariantResponse } from '~/utils/misc.ts'

export async function loader({ params }: DataFunctionArgs) {
	invariantResponse(params.fileId, 'File ID is required', { status: 400 })
	const file = await prisma.file.findUnique({
		where: { id: params.fileId },
		select: { contentType: true, blob: true },
	})

	invariantResponse(file, 'Not found', { status: 404 })

	return new Response(file.blob, {
		headers: {
			'Content-Type': file.contentType,
			'Cache-Control': 'max-age=31536000',
		},
	})
}
