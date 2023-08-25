import { json, redirect, type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { SearchBar } from '#app/components/search-bar.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { cn, getUserImgSrc, useDelayedIsSubmitting } from '#app/utils/misc.ts'

// 🐨 add a new schema here for the search results. Each entry should have an
// id, username, and (nullable) name

export async function loader({ request }: DataFunctionArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search')
	if (searchTerm === '') {
		return redirect('/users')
	}

	const like = `%${searchTerm ?? ''}%`
	// 🐨 rename this to "rawUsers"
	const users = await prisma.$queryRaw`
		SELECT user.id, user.username, user.name
		FROM User AS user
		WHERE user.username LIKE ${like}
		OR user.name LIKE ${like}
		LIMIT 50
	`

	// 🐨 use your new schema to safely parse the rawUsers.
	//   If there's an error, then return json with the error (result.error.message)
	//   If there is not an error, then return json with the users

	return json({ status: 'idle', users } as const)
}

export default function UsersRoute() {
	const data = useLoaderData<typeof loader>()
	const isSubmitting = useDelayedIsSubmitting({
		formMethod: 'GET',
		formAction: '/users',
	})

	// 💰 uncomment this to log the full error to the console:
	// if (data.status === 'error') {
	// 	console.error(data.error)
	// }

	return (
		<div className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6">
			<h1 className="text-h1">Epic Notes Users</h1>
			<div className="w-full max-w-[700px] ">
				<SearchBar status={data.status} autoFocus autoSubmit />
			</div>
			<main>
				{data.status === 'idle' ? (
					// @ts-expect-error 💣 remove this now
					data.users.length ? (
						<ul
							className={cn(
								'flex w-full flex-wrap items-center justify-center gap-4 delay-200',
								{ 'opacity-50': isSubmitting },
							)}
						>
							{/* @ts-expect-error 💣 remove this now */}
							{data.users.map(user => (
								<li key={user.id}>
									<Link
										to={user.username}
										className="flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3"
									>
										<img
											alt={user.name ?? user.username}
											// add a ts-expect-error here. We'll fix this one next.
											src={getUserImgSrc(user.image?.id)}
											className="h-16 w-16 rounded-full"
										/>
										{user.name ? (
											<span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md">
												{user.name}
											</span>
										) : null}
										<span className="w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground">
											{user.username}
										</span>
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p>No users found</p>
					)
				) : // 💰 add "import { ErrorList } from '#app/components/forms.tsx'" to the top and uncomment this to display the error:
				// data.status === 'error' ? (
				// <ErrorList errors={['There was an error parsing the results']} />
				// ) :
				null}
			</main>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
