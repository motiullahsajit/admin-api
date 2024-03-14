import pool from "./database";

export default async function idAdmin(id: string) {
  const client = await pool.connect();

  const query = "SELECT role FROM users WHERE id = $1";

  const { rows } = await client.query(query, [id]);

  client.release();

  if (rows.length === 0) return false;
  else if (rows[0].role === "admin") return true;
}
