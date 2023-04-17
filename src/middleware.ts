import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { headers } from 'next/dist/client/components/headers';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    console.log('middleware hit');
    console.log(JSON.stringify(headers));
    console.log(request.url);
    console.log(request.method);

    // const requestHeaders = new Headers(request.headers)
    // requestHeaders.set('Content-Type', 'application/json');
    // requestHeaders.set('Access-Control-Allow-Origin','*');

    // You can also set request headers in NextResponse.rewrite
    // const response = NextResponse.next({
    //     request: {
    //         // New request headers
    //         headers: requestHeaders,
    //     },
    // })

    // return NextResponse.next()

    // Set new response headers
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Access-Control-Allow-Origin','*');
    return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/orders']
}