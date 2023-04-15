import { Pool } from '@neondatabase/serverless';
// import type { NextRequest, NextFetchEvent } from 'next/server';

export async function GET(request: Request, { params }: {
    params: { id: string }
  }) {
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query(`SELECT * FROM books WHERE id = ${params.id}`);
    console.log(rows);
    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(JSON.stringify(rows));
}

export const runtime = 'edge';

// export default async (req: NextRequest, event: NextFetchEvent) => {