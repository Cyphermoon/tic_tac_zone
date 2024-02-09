import Container from '@/components/common/Container'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NotFoundIllustration from '@/public/not_found.gif'

const NotFound = () => {
    return (
        <Container as='main' className='py-20'>
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                <div className="flex items-center justify-center rounded-full border border-gray-200  w-32 h-32 p-4">
                    <Image src={NotFoundIllustration} alt='Not Found Illustration' width={200} height={200} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Uh oh! {"You're"} lost in the clouds.</h1>
                    <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400">
                        You came across a page that {"doesn't"} exist or has not been created yet.
                    </p>
                </div>
                <Link
                    className="inline-flex h-10 items-center rounded-md border border-gray-200 bg-accent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-800 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 text-gray-300"
                    href="/"
                >
                    Back to Home
                </Link>
            </div>

        </Container>
    )
}

export default NotFound