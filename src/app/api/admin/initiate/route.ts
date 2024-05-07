import pool from "../../../../../utils/database";
import { sendResetCodeByEmail } from "../../../../../utils/helper";

export async function POST(req: Request) {
  try {
    const userData = await req.json();
    const { email } = userData;

    if (!email) {
      return Response.json({ message: "Email is required." });
    }

    const client = await pool.connect();

    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      return Response.json({ message: "Email is not registered." });
    }

    const resetCode = Math.floor(10000 + Math.random() * 90000).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    await client.query(`
    CREATE TABLE IF NOT EXISTS reset_codes (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      code VARCHAR(10) NOT NULL,
      expiration_time TIMESTAMP NOT NULL
    )
  `);

    await client.query(
      "INSERT INTO reset_codes (username, email, code, expiration_time) VALUES ($1, $2, $3, $4)",
      [user.rows[0].username, user.rows[0].email, resetCode, expirationTime]
    );

    await sendResetCodeByEmail(email, resetCode);

    return Response.json({
      success: true,
      message:
        "Password reset initiated. Check your email for further instructions.",
    });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}
