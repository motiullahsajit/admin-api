"use client";
import { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import styles from "../table.module.scss";
import axios from "axios";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const response: any = await axios.get(`/api/course?adminId=${userId}`);
        setCourses(response?.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (id: number) => {
    console.log("Update Faculty with ID:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete Faculty with ID:", id);
  };

  return (
    <main className="flex">
      <SideBar />
      <section className={styles["section"]}>
        <div className={styles["div-section"]}>
          <h2>All Courses</h2>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Course Code</th>
                <th>Credit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.course_code}</td>
                  <td>{course.credit}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(course.id)}
                      className={styles["button"]}
                    >
                      <AiFillEdit />
                    </button>
                    <button onClick={() => handleDelete(course.id)}>
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
