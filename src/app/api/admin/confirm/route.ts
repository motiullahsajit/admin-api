import pool from "../../../../../utils/database";

export async function POST(req: Request) {
  try {
    const userData = await req.json();
    const { code, newPassword } = userData;
    const client = await pool.connect();
    if (!code || !newPassword) {
      return Response.json({
        message: "Code and new password are required.",
      });
    }

    const resetCodeEntry = await client.query(
      "SELECT * FROM reset_codes WHERE code = $1",
      [code]
    );

    if (!resetCodeEntry.rows.length) {
      return Response.json({ message: "Reset code not found or expired." });
    }

    const currentTime = new Date();
    if (currentTime > resetCodeEntry.rows[0].expiration_time) {
      return Response.json({ message: "Reset code has expired." });
    }

    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      resetCodeEntry.rows[0].email,
    ]);

    if (!user.rows.length) {
      return Response.json({ message: "Email is not registered." });
    }

    await client.query("UPDATE users SET password = $1 WHERE email = $2", [
      newPassword,
      user.rows[0].email,
    ]);

    await client.query("DELETE FROM reset_codes WHERE code = $1", [code]);

    return Response.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error confirming password reset:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}
