import { Pool } from '@neondatabase/serverless';
import { headers } from 'next/headers';

export async function GET(request: Request, { params }: {
    params: { id: string }
  }) {
    
    const headersList = headers();
    const apiClientId = headersList.get('x-api-client-id-from-middleware');
    console.log('apiClientId in GET /orders/id:', apiClientId);

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1',[params.id]);
    
    let content: string;

    console.log(rows);

    if (!rows || rows.length === 0) {
        content = JSON.stringify({
            "error":`No order with id ${params.id}`
        });
    } else {
        if (rows[0].createdBy !== apiClientId) {
            content = JSON.stringify({message: 'order not found for this user'});
        } else {
            content = JSON.stringify(rows[0]);
        }
    }
    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(content);
}

export async function DELETE(request: Request, { params }: {
    params: { id: string }
  }) {

    const headersList = headers();
    const apiClientId = headersList.get('x-api-client-id-from-middleware');
    console.log('apiClientId in DELETE /orders/id:', apiClientId);

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [params.id]);
    
    let content: string = '';
    if (!rows || rows.length === 0) {
        content = JSON.stringify({
            "error":`No order with id ${params.id}`
        });
    } else if (rows[0].createdBy !== apiClientId) {
        content = JSON.stringify({message: 'order not found for this user'});
    } else {
        await pool.query('DELETE FROM orders WHERE id = $1', [params.id]);
        content = JSON.stringify({ message: `Order with id ${params.id} deleted`})
    }

    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(content);
}

export const runtime = 'edge';
