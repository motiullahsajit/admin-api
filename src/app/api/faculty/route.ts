import pool from "../../../../utils/database";
import isAdmin from "../../../../utils/middleware";

export async function GET(req: any) {
  try {
    const client = await pool.connect();
    const url = await req.nextUrl.searchParams;
    const adminId = url.get("adminId");
    const facultyId = url.get("facultyId");
    const action = await isAdmin(adminId);

    if (!action) {
      return Response.json({ message: "Access denied" });
    }

    let query = "SELECT * FROM faculty";

    if (facultyId) {
      query += " WHERE id = $1";
      const { rows } = await client.query(query, [facultyId]);

      client.release();

      if (rows.length === 0) {
        return Response.json({ message: "Faculty not found" });
      }

      return Response.json(rows[0]);
    } else {
      const { rows } = await client.query(query);

      client.release();

      return Response.json(rows);
    }
  } catch (error) {
    console.error("Error fetching faulty faculty data:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}

export async function POST(req: Request) {
  try {
    const faculty = await req.json();
    const {
      name,
      username,
      email,
      qualifications,
      department_id,
      courses,
      phone_number,
    } = faculty;

    if (
      !name ||
      !username ||
      !email ||
      !qualifications ||
      !department_id ||
      !courses ||
      !phone_number
    ) {
      return Response.json({ message: "Required fields are missing" });
    }

    const client = await pool.connect();

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS faculty (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          qualifications TEXT,
          department_id VARCHAR(50) NOT NULL,
          courses TEXT[],
          phone_number VARCHAR(20) NOT NULL
        )`;
    await client.query(createTableQuery);

    const insertQuery = `
        INSERT INTO faculty (name, username, email, qualifications, department_id, courses, phone_number) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    await client.query(insertQuery, [
      name,
      username,
      email,
      qualifications,
      department_id,
      courses,
      phone_number,
    ]);

    client.release();

    return Response.json({ message: "Faculty added successfully" });
  } catch (error: any) {
    if (error.code === "23505" && error.constraint === "faculty_username_key") {
      return Response.json({ message: "Username already exists" });
    } else if (
      error.code === "23505" &&
      error.constraint === "faculty_email_key"
    ) {
      return Response.json({ message: "Email already exists" });
    } else {
      console.error("Error creating faculty data:", error);
      return Response.json({ message: "Internal Server Error" });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const facultyData = await req.json();
    const {
      id,
      name,
      username,
      email,
      qualifications,
      department_id,
      courses,
      phone_number,
    } = facultyData;

    if (!id) {
      return Response.json({ message: "ID parameter is required" });
    }

    const client = await pool.connect();

    const checkExistenceQuery = "SELECT * FROM faculty WHERE id = $1";
    const { rows } = await client.query(checkExistenceQuery, [id]);

    if (rows.length === 0) {
      client.release();
      return Response.json({ message: "Faculty not found" });
    }

    const updateQueryParts = [];
    const queryParams = [];

    let queryIndex = 1;

    if (name !== undefined) {
      updateQueryParts.push(`name = $${queryIndex++}`);
      queryParams.push(name);
    }

    if (username !== undefined) {
      updateQueryParts.push(`username = $${queryIndex++}`);
      queryParams.push(username);
    }

    if (email !== undefined) {
      updateQueryParts.push(`email = $${queryIndex++}`);
      queryParams.push(email);
    }

    if (qualifications !== undefined) {
      updateQueryParts.push(`qualifications = $${queryIndex++}`);
      queryParams.push(qualifications);
    }

    if (department_id !== undefined) {
      updateQueryParts.push(`department_id = $${queryIndex++}`);
      queryParams.push(department_id);
    }

    if (courses !== undefined) {
      updateQueryParts.push(`courses = $${queryIndex++}`);
      queryParams.push(courses);
    }

    if (phone_number !== undefined) {
      updateQueryParts.push(`phone_number = $${queryIndex++}`);
      queryParams.push(phone_number);
    }

    const updateQuery = `
      UPDATE faculty 
      SET ${updateQueryParts.join(", ")}
      WHERE id = $${queryIndex}`;

    queryParams.push(id);

    await client.query(updateQuery, queryParams);

    client.release();

    return Response.json({ message: "Faculty updated successfully" });
  } catch (error: any) {
    console.error("Error updating faculty data:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}

export async function DELETE(req: any) {
  try {
    const client = await pool.connect();
    const url = await req.nextUrl.searchParams;
    const adminId = url.get("adminId");
    const action = await isAdmin(adminId);

    const { id } = await req.json();

    if (!action) {
      client.release();
      return Response.json({ message: "Access denied" });
    }

    if (!id) {
      client.release();
      return Response.json({
        message: "Please provide a facultyId to delete a specific faculty",
      });
    }

    const deleteQuery = "DELETE FROM faculty WHERE id = $1";
    const { rowCount } = await client.query(deleteQuery, [id]);

    client.release();

    if (rowCount === 0) {
      return Response.json({ message: "Faculty not found" });
    }

    return Response.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}
