"use client";
import { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import styles from "../table.module.scss";
import axios from "axios";

export default function Guardians() {
  const [guardians, setGuardians] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response: any = await axios.get(
          `/api/guardian?adminId=${userId}`
        );
        setGuardians(response?.data);
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
          <h2>All Guardians</h2>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Student Id</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {guardians.map((guardian) => (
                <tr key={guardian.id}>
                  <td>{guardian.id}</td>
                  <td>{guardian.name}</td>
                  <td>{guardian.email}</td>
                  <td>{guardian.student_id}</td>
                  <td>{guardian.phone_number}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(guardian.id)}
                      className={styles["button"]}
                    >
                      <AiFillEdit />
                    </button>
                    <button onClick={() => handleDelete(guardian.id)}>
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
