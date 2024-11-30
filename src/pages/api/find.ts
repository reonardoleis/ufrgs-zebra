import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { ZebraPuzzle } from '@/services/types';
import { Puzzle } from '@/entities';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;
  const code = query.code as string;
  if (!code) {
    return res.status(400).json({ success: false, error: '"code" is required.' });
  }

  try {
    const result = await sql<Puzzle>`
      SELECT * FROM puzzles 
      WHERE play_code = ${code} OR edit_code = ${code};
    `;

    if (result.rowCount === 0) return res.status(404).json({ success: true });

    const puzzle = result.rows[0];
    if (puzzle.play_code === code) {
      puzzle.edit_code = '';
    }
    
    return res.status(200).json({ success: true, data: puzzle });
  } catch (e) {
    console.error('Error while fetching puzzle:', e);
    return res.status(500).json({ success: false, error: e });
  }
}
