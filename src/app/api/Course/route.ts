import pool from "../../../../utils/database";
import isAdmin from "../../../../utils/middleware";

export async function GET(req: any) {
  try {
    const client = await pool.connect();
    const url = await req.nextUrl.searchParams;
    const adminId = url.get("adminId");
    const courseId = url.get("courseId");
    const action = await isAdmin(adminId);

    if (!action) {
      return Response.json({ message: "Access denied" });
    }

    let query = "SELECT * FROM course";

    if (courseId) {
      query += " WHERE id = $1";
      const { rows } = await client.query(query, [courseId]);

      client.release();

      if (rows.length === 0) {
        return Response.json({ message: "Course not found" });
      }

      return Response.json(rows[0]);
    } else {
      const { rows } = await client.query(query);

      client.release();

      if (rows.length === 0) {
        return Response.json({ message: "No Course Exits" });
      }

      return Response.json(rows);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return Response.json({ message: "Error fetching courses" });
  }
}

export async function POST(req: Request) {
  try {
    const course = await req.json();
    const { name, course_code, description, credit, course_outline } = course;

    if (!name || !course_code || !description || !credit || !course_outline) {
      return Response.json({ message: "Required fields are missing" });
    }

    const client = await pool.connect();

    const checkTableQuery = `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'course'
        )`;
    const { rows } = await client.query(checkTableQuery);
    const tableExists = rows[0].exists;

    if (!tableExists) {
      const createTableQuery = `
          CREATE TABLE course (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            course_code VARCHAR(20) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            credit INT NOT NULL,
            course_outline TEXT NOT NULL
          )`;
      await client.query(createTableQuery);
    }

    const insertQuery = `
        INSERT INTO course (name, course_code, description, credit, course_outline) 
        VALUES ($1, $2, $3, $4, $5)`;
    await client.query(insertQuery, [
      name,
      course_code,
      description,
      credit,
      course_outline,
    ]);

    client.release();

    return Response.json({ message: "Course added successfully" });
  } catch (error: any) {
    if (
      error.code === "23505" &&
      error.constraint === "course_course_code_key"
    ) {
      return Response.json({ message: "Course code already exists" });
    } else {
      console.error("Error creating course:", error);
      return Response.json({ message: "Internal Server Error" });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const courseData = await req.json();
    const { id, name, course_code, description, credit, course_outline } =
      courseData;

    if (!id) {
      return Response.json({ message: "ID parameter is required" });
    }

    const client = await pool.connect();

    const checkExistenceQuery = "SELECT * FROM course WHERE id = $1";
    const { rows } = await client.query(checkExistenceQuery, [id]);

    if (rows.length === 0) {
      client.release();
      return Response.json({ message: "Course not found" });
    }

    const updateQueryParts = [];
    const queryParams = [];

    let queryIndex = 1;

    if (name !== undefined) {
      updateQueryParts.push(`name = $${queryIndex++}`);
      queryParams.push(name);
    }

    if (course_code !== undefined) {
      updateQueryParts.push(`course_code = $${queryIndex++}`);
      queryParams.push(course_code);
    }

    if (description !== undefined) {
      updateQueryParts.push(`description = $${queryIndex++}`);
      queryParams.push(description);
    }

    if (credit !== undefined) {
      updateQueryParts.push(`credit = $${queryIndex++}`);
      queryParams.push(credit);
    }

    if (course_outline !== undefined) {
      updateQueryParts.push(`course_outline = $${queryIndex++}`);
      queryParams.push(course_outline);
    }

    const updateQuery = `
      UPDATE course 
      SET ${updateQueryParts.join(", ")}
      WHERE id = $${queryIndex}`;

    queryParams.push(id);

    await client.query(updateQuery, queryParams);

    client.release();

    return Response.json({ message: "Course updated successfully" });
  } catch (error: any) {
    console.error("Error updating course:", error);
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
        message: "Please provide a courseId to delete a specific course",
      });
    }

    const deleteQuery = "DELETE FROM course WHERE id = $1";
    const { rowCount } = await client.query(deleteQuery, [id]);

    client.release();

    if (rowCount === 0) {
      return Response.json({ message: "Course not found" });
    }

    return Response.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}
