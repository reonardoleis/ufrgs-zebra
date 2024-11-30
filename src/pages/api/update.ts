import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from '@vercel/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body } = req;
  
  try {
    await sql`
    UPDATE puzzles SET puzzle = ${body.puzzle} WHERE edit_code = ${body.edit_code}
  `;

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log('Error while creating puzzle:', e);
    return  res.status(500).json({ success: false, error: e });
  }
}
