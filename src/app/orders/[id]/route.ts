import { Pool } from '@neondatabase/serverless';

export async function GET(request: Request, { params }: {
    params: { id: string }
  }) {
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1',[params.id]);
    
    let content: string;

    console.log(rows);

    if (!rows || rows.length === 0) {
        content = JSON.stringify({
            "error":`No order with id ${params.id}`
        });
    } else {
        content = JSON.stringify(rows[0]);
    }
    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(content);
}

export async function DELETE(request: Request, { params }: {
    params: { id: string }
  }) {

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [params.id]);
    
    let content: string;
    if (!rows || rows.length === 0) {
        content = JSON.stringify({
            "error":`No order with id ${params.id}`
        });
    } else {
        await pool.query(`DELETE FROM orders WHERE id = ${params.id}`);
    }

    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response();
}

export const runtime = 'edge';
