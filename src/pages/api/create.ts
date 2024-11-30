import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from '@vercel/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body } = req;
  
  try {
    const result = await sql`
    INSERT INTO puzzles(puzzle) VALUES(${JSON.stringify(body.puzzle)}) RETURNING *
  `;

    return res.status(200).json({ success: true, data: result.rows[0]});
  } catch (e) {
    console.log('Error while creating puzzle:', e);
    return  res.status(500).json({ success: false, error: e });
  }
}
