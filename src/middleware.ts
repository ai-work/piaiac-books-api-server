import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify, type JWTPayload } from 'jose';

async function verify(token: string, secret: string): Promise<any> {
    //{ apiClientId: string, clientName: string, clientEmail: string, accessPermissions: string }
    const {payload} = await jwtVerify(token, new TextEncoder().encode(secret));
    // run some checks on the returned payload, perhaps you expect some specific values
    console.log(payload);
    // if its all good, return it, or perhaps just return a boolean
    return payload;
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest, ) {
    let currentAuthToken = request.headers.get('Authorization');
    console.log(currentAuthToken);
    let response: NextResponse;
    if (!currentAuthToken) {
        // Respond with JSON indicating an error message
        return new NextResponse(
                JSON.stringify({ success: false, message: 'authentication failed - no Bearer token provided' }),
                { status: 401, headers: { 'content-type': 'application/json' } }
        );
    } else { 
        if (currentAuthToken.indexOf('Bearer ') < 0) {
          return new NextResponse(
              JSON.stringify({ success: false, message: 'authentication failed - malformed Bearer token provided' }),
              { status: 401, headers: { 'content-type': 'application/json' } }
          );
        } else {
            currentAuthToken = currentAuthToken.substring(currentAuthToken.indexOf('Bearer ') + 7);
            console.log(currentAuthToken);
            const result = verify(currentAuthToken, process.env.JWT_SECRET as string);
        }
    }

    response = NextResponse.next();
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