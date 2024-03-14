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
    const { name, username, email, qualifications, department_id, courses } =
      faculty;

    if (
      !name ||
      !username ||
      !email ||
      !qualifications ||
      !department_id ||
      !courses
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
          courses TEXT[]
        )`;
    await client.query(createTableQuery);

    const insertQuery = `
        INSERT INTO faculty (name, username, email, qualifications, department_id, courses) 
        VALUES ($1, $2, $3, $4, $5, $6)`;
    await client.query(insertQuery, [
      name,
      username,
      email,
      qualifications,
      department_id,
      courses,
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

    if (name) {
      updateQueryParts.push("name = $1");
      queryParams.push(name);
    }

    if (username) {
      updateQueryParts.push("username = $2");
      queryParams.push(username);
    }

    if (email) {
      updateQueryParts.push("email = $3");
      queryParams.push(email);
    }

    if (qualifications) {
      updateQueryParts.push("qualifications = $4");
      queryParams.push(qualifications);
    }

    if (department_id) {
      updateQueryParts.push("department_id = $5");
      queryParams.push(department_id);
    }

    if (courses) {
      updateQueryParts.push("courses = $6");
      queryParams.push(courses);
    }

    const updateQuery = `
          UPDATE faculty 
          SET ${updateQueryParts.join(", ")}
          WHERE id = $${queryParams.length + 1}`;

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
