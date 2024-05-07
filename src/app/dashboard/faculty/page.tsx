"use client";
import { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import styles from "../table.module.scss";
import axios from "axios";

interface Faculty {
  id: number;
  name: string;
  username: string;
  email: string;
  qualifications: string;
  department_id: string;
  courses: string[];
  phone_number: string;
}

export default function Faculty() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axios.get("/api/faculty?adminId=5");
        setFaculties(response?.data);
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
          <h2>All Faculty</h2>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Qualifications</th>
                <th>Department</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.id}>
                  <td>{faculty.name}</td>
                  <td>{faculty.username}</td>
                  <td>{faculty.email}</td>
                  <td>{faculty.qualifications}</td>
                  <td>{faculty.department_id}</td>
                  <td>{faculty.phone_number}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(faculty.id)}
                      className={styles["button"]}
                    >
                      <AiFillEdit />
                    </button>
                    <button onClick={() => handleDelete(faculty.id)}>
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
