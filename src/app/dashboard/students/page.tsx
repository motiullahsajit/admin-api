"use client";
import { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import styles from "../table.module.scss";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axios.get("/api/student?adminId=5");
        setStudents(response?.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (id: number) => {
    // Implement update logic
    console.log("Update Faculty with ID:", id);
  };

  const handleDelete = (id: number) => {
    // Implement delete logic
    console.log("Delete Faculty with ID:", id);
  };

  return (
    <main className="flex">
      <SideBar />
      <section className={styles["section"]}>
        <div className={styles["div-section"]}>
          <h2>All Students</h2>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.phone_number}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(student.id)}
                      className={styles["button"]}
                    >
                      <AiFillEdit />
                    </button>
                    <button onClick={() => handleDelete(student.id)}>
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
