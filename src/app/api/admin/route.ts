import pool from "../../../../utils/database";

export async function GET(req: any) {
  try {
    const url = await req.nextUrl.searchParams;
    const id = url.get("id");

    let query =
      "SELECT id, username, email, full_name, phone_number, role, dob FROM users";

    const client = await pool.connect();

    if (id) {
      query += " WHERE id = $1";
      const { rows } = await client.query(query, [id]);

      client.release();

      if (rows.length === 0) {
        return Response.json({ message: "User not found" });
      }

      return Response.json(rows[0]);
    } else {
      const { rows } = await client.query(query);

      client.release();

      if (rows.length === 0) {
        return Response.json({ message: "No User Exits" });
      }

      return Response.json(rows);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ message: "Error fetching users" });
  }
}

export async function POST(req: Request) {
  try {
    const userData = await req.json();

    if (!userData?.username || !userData?.password) {
      return Response.json({ message: "Username and password are required" });
    }

    const client = await pool.connect();

    const query = `
      SELECT * FROM users 
      WHERE username = $1 AND password = $2`;

    const { rows } = await client.query(query, [
      userData.username,
      userData.password,
    ]);

    client.release();

    if (rows.length > 0) {
      return Response.json({ message: `Welcome ${rows[0].username}` });
    } else {
      return Response.json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}

export async function PUT(req: Request) {
  try {
    const userData = await req.json();

    const { username, email, oldPassword, newPassword } = userData;

    if (!username || !email || !oldPassword || !newPassword) {
      return Response.json({
        message: "Username, email, old password, and new password are required",
      });
    }

    const client = await pool.connect();

    const queryCheckPassword = `
      SELECT * FROM users 
      WHERE username = $1 AND email = $2 AND password = $3`;

    const { rows: matchingUsers } = await client.query(queryCheckPassword, [
      username,
      email,
      oldPassword,
    ]);

    if (matchingUsers.length === 0) {
      client.release();
      return Response.json({
        message: "Invalid username, email, or old password",
      });
    }

    const queryUpdatePassword = `
      UPDATE users 
      SET password = $1 
      WHERE username = $2 AND email = $3`;

    await client.query(queryUpdatePassword, [newPassword, username, email]);

    client.release();

    return Response.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}
