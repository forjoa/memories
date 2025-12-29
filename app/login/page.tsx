import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const ERROR_MESSAGES = {
    not_found: 'username or email not found',
    invalid_credentials: 'incorrect password, please try again',
    server_error: 'server error, please try again later',
}
export default async function Login({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const errorKey = (await searchParams).e as unknown as keyof typeof ERROR_MESSAGES | undefined
    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                action="/api/login"
                method="post"
                className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
                <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div>
                        <Link
                            href="/"
                            aria-label="go home">

                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">log in</h1>
                        <p className="text-sm">welcome back</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="username"
                                className="block text-sm">
                                username / email
                            </Label>
                            <Input
                                type="text"
                                required
                                name="username"
                                id="username"
                                placeholder="username or email@memories.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="block text-sm">
                                password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="password"
                                id="password"
                                placeholder="******"
                            />
                        </div>

                        {errorKey && (
                            <div className='border border-red-500 p-2 rounded-md'>
                                <span className='text-sm text-red-500'>{ERROR_MESSAGES[errorKey]}</span>
                            </div>
                        )}

                        <Button className="w-full" type='submit'>log in</Button>
                    </div>
                </div>

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        don&apos;t have an account?
                        <Button
                            asChild
                            variant="link"
                            className="px-2">
                            <Link href="/register">register</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}