"use client"
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
const Providers = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                retry: 1,
            },
        },
    }));
    return (
        <QueryClientProvider client={queryClient}>
            <NextTopLoader color="000000" />
            <div className='w-1/2'>
                {children}
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default Providers
