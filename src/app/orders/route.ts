import { Pool } from '@neondatabase/serverless';

export async function GET(request: Request) {
    
    const apiClientId = '';
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query('SELECT * FROM orders WHERE createdBy = $1 ', [apiClientId]);
    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(JSON.stringify(rows));
}

export async function POST(request: Request) {
    
    let  { bookId, quantity, customerName }: {bookId: number, quantity: number, customerName: string} = await request.json();
    if (!quantity || quantity == 0) {
        quantity = 1;
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const { rows } = await pool.query('INSERT INTO orders(id, bookId, customerName, created, createdBy, quantity, timestamp) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, created', 
                                    [randomHash(21), bookId, customerName, true, 'self',quantity, Math.floor((new Date).getTime()/1000)])

    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(JSON.stringify({ orderId: rows[0].id, created: rows[0].created}));
}

function randomHash(length: number) {
    let pool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
    
    let buf = "";
  
    for (let i = 0; i < length; i++) {
      buf += pool.charAt(Math.floor(Math.random() * pool.length));
    }
  
    return buf;
}

export const runtime = 'edge';