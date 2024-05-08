"use client";
import { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import styles from "../table.module.scss";
import axios from "axios";
import Modal from "./Modal";
import ConfirmModal from "../../../../components/ConfirmModal/ConfirmModal";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number>();
  const [studentToUpdate, setStudentToUpdate] = useState<any | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response: any = await axios.get(`/api/student?adminId=${userId}`);
      setStudents(response?.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleUpdate = (student: any) => {
    setIsUpdateMode(true);
    setStudentToUpdate(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setStudentToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const closeModal = () => {
    setIsUpdateMode(false);
    setStudentToUpdate(null);
    setIsModalOpen(false);
    setIsConfirmModalOpen(false);
    fetchData();
  };

  const handleDeleteConfirmed = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.delete(`/api/student?adminId=${userId}`, {
        data: { id: studentToDelete },
      });
      alert(response.data.message);
      setIsConfirmModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex">
      <SideBar />
      <section className={styles["section"]}>
        <div className={styles["div-section"]}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">All Students</h1>
            <div>
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Add Student
              </button>
            </div>
          </div>
          {students.length > 0 ? (
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
                        onClick={() => handleUpdate(student)}
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
          ) : (
            <h1 className="text-2xl">
              There is currently no students list available.
            </h1>
          )}
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        isUpdate={isUpdateMode}
        studentToUpdate={studentToUpdate}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </main>
  );
}
