import bcrypt from "bcryptjs";
import pool from "../../../../utils/database";
import isAdmin from "../../../../utils/middleware";

export async function GET(req: any) {
  try {
    const client = await pool.connect();
    const url = await req.nextUrl.searchParams;
    const adminId = url.get("adminId");
    const studentId = url.get("studentId");
    const action = await isAdmin(adminId);

    if (!action) {
      return Response.json({ message: "Access denied" });
    }

    let query =
      "SELECT id, name, username, email, guardian_id, phone_number, address, department FROM student";

    if (studentId) {
      query += " WHERE id = $1";
      const { rows } = await client.query(query, [studentId]);

      client.release();

      if (rows.length === 0) {
        return Response.json({ message: "Student not found" });
      }

      return Response.json(rows[0]);
    } else {
      const { rows } = await client.query(query);

      client.release();

      if (rows.length === 0) {
        return Response.json({ message: "No Student Exists" });
      }

      return Response.json(rows);
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    return Response.json({ message: "Error fetching students" });
  }
}

export async function POST(req: Request) {
  try {
    const student = await req.json();
    const {
      name,
      username,
      email,
      password,
      guardian_id,
      phone_number,
      address,
      department,
    } = student;

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !guardian_id ||
      !phone_number ||
      !address ||
      !department
    ) {
      return Response.json({ message: "Required fields are missing" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const client = await pool.connect();

    const checkTableQuery = `
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'student'
          )`;
    const { rows } = await client.query(checkTableQuery);
    const tableExists = rows[0].exists;

    if (!tableExists) {
      const createTableQuery = `
            CREATE TABLE student (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              username VARCHAR(255) UNIQUE NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              guardian_id INT NOT NULL,
              phone_number VARCHAR(20),
              address TEXT,
              department VARCHAR(100)
            )`;
      await client.query(createTableQuery);
    }

    const insertQuery = `
          INSERT INTO student (name, username, email, password, guardian_id, phone_number, address, department) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    await client.query(insertQuery, [
      name,
      username,
      email,
      hashedPassword,
      guardian_id,
      phone_number,
      address,
      department,
    ]);

    client.release();

    return Response.json({ message: "Student added successfully" });
  } catch (error: any) {
    if (error.code === "23505" && error.constraint === "student_username_key") {
      return Response.json({ message: "Username already exists" });
    } else if (
      error.code === "23505" &&
      error.constraint === "student_email_key"
    ) {
      return Response.json({ message: "Email already exists" });
    } else {
      console.error("Error creating student:", error);
      return Response.json({ message: "Internal Server Error" });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const studentData = await req.json();
    const {
      id,
      name,
      username,
      email,
      password,
      guardian_id,
      phone_number,
      address,
      department,
    } = studentData;

    if (!id) {
      return Response.json({ message: "ID parameter is required" });
    }

    const client = await pool.connect();

    const checkExistenceQuery = "SELECT * FROM student WHERE id = $1";
    const { rows } = await client.query(checkExistenceQuery, [id]);

    if (rows.length === 0) {
      client.release();
      return Response.json({ message: "Student not found" });
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

    if (password !== undefined) {
      updateQueryParts.push(`password = $${queryIndex++}`);
      queryParams.push(password);
    }

    if (guardian_id !== undefined) {
      updateQueryParts.push(`guardian_id = $${queryIndex++}`);
      queryParams.push(guardian_id);
    }

    if (phone_number !== undefined) {
      updateQueryParts.push(`phone_number = $${queryIndex++}`);
      queryParams.push(phone_number);
    }

    if (address !== undefined) {
      updateQueryParts.push(`address = $${queryIndex++}`);
      queryParams.push(address);
    }

    if (department !== undefined) {
      updateQueryParts.push(`department = $${queryIndex++}`);
      queryParams.push(department);
    }

    const updateQuery = `
        UPDATE student 
        SET ${updateQueryParts.join(", ")}
        WHERE id = $${queryIndex}`;

    queryParams.push(id);

    await client.query(updateQuery, queryParams);

    client.release();

    return Response.json({ message: "Student updated successfully" });
  } catch (error: any) {
    console.error("Error updating student:", error);
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
        message: "Please provide a studentId to delete a specific student",
      });
    }

    const deleteQuery = "DELETE FROM student WHERE id = $1";
    const { rowCount } = await client.query(deleteQuery, [id]);

    client.release();

    if (rowCount === 0) {
      return Response.json({ message: "Student not found" });
    }

    return Response.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}
