import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify } from 'jose';

const allowedAccessTypes:string[] = ['/orders'];

async function verify(token: string, secret: string): Promise<any> {
    //{ apiClientId: string, clientName: string, clientEmail: string, accessPermissions: string }
    const {payload} = await jwtVerify(token, new TextEncoder().encode(secret));
    // run some checks on the returned payload, perhaps you expect some specific values
    console.log('in verify: ', JSON.stringify(payload));
    // if its all good, return it, or perhaps just return a boolean
    return payload;
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, ) {
    let jwtAuthToken = request.headers.get('Authorization');
    console.log(jwtAuthToken);
    let response: NextResponse;
    if (!jwtAuthToken) {
        // Respond with JSON indicating an error message
        return new NextResponse(
                JSON.stringify({ success: false, message: 'authentication failed - no Bearer token provided' }),
                { status: 401, headers: { 'content-type': 'application/json' } }
        );
    } else { 

        let decodedToken: any;
        if (jwtAuthToken.toLowerCase().startsWith('bearer')) {
            jwtAuthToken = jwtAuthToken.slice('bearer'.length).trim();
            console.log('jwtAuthToken:', jwtAuthToken);
            decodedToken = await verify(jwtAuthToken, process.env.JWT_SECRET as string);
            console.log('decoded:',decodedToken);

            // const hasAccessToEndpoint = config.matcher.some(
            //     (at: string) => decodedToken.accessTypes.some((uat:string) => uat === at)
            // );
            
            // if (!hasAccessToEndpoint) {
            //     return new NextResponse(
            //         JSON.stringify({ success: false, message: 'not enough privileges to access endpoint' }),
            //         { status: 401, headers: { 'content-type': 'application/json' } }
            //     );
            // }
            // Clone the request headers and set a new header `x-hello-from-middleware1`

            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('x-api-client-id-from-middleware', decodedToken.apiClientId);

            // You can also set request headers in NextResponse.rewrite
            response = NextResponse.next({
                request: {
                    // New request headers
                    headers: requestHeaders,
                },
            });
        } else {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'authentication failed - malformed Bearer token provided' }),
                { status: 401, headers: { 'content-type': 'application/json' } }
            );
        }
    }

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/orders']
}

// import type { NextApiRequest, NextApiResponse } from 'next';
// import Cookies from 'cookies';
// import jwt from 'jsonwebtoken';

// export default async function (req: NextApiRequest, res: NextApiResponse) {
//   const splitPem = process.env.CLERK_JWT_VERIFICATION_KEY.match(/.{1,64}/g);
//   const publicKey =
//     '-----BEGIN PUBLIC KEY-----\n' +
//     splitPem.join('\n') +
//     '\n-----END PUBLIC KEY-----';

//   const cookies = new Cookies(req, res);
//   const sessToken = cookies.get('__session');
//   if (!sessToken) {
//     res.status(401).json({ error: 'not signed in' });
//   }

//   try {
//     var decoded = jwt.verify(sessToken, publicKey);
//   } catch (error) {
//     res.status(400).json({
//       error: 'Invalid Token'
//     });
//     return;
//   }

//   res.status(200).json({ sessToken: decoded });
// }