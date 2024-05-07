"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import Modal from "./Modal";
import styles from "../table.module.scss";
import ConfirmModal from "../../../../components/ConfirmModal/ConfirmModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<number>();
  const [facultyToUpdate, setFacultyToUpdate] = useState<Faculty | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response: any = await axios.get(`/api/faculty?adminId=${userId}`);
      setFaculties(response?.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await axios.delete(`/api/faculty?adminId=${userId}`, {
        data: { id: facultyToDelete },
      });
      alert(response.data.message);
      setIsConfirmModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const openModal = (isUpdate: boolean, faculty?: Faculty) => {
    setIsUpdateMode(isUpdate);
    setIsModalOpen(true);
    if (isUpdate) {
      setFacultyToUpdate(faculty || null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdateMode(false);
    setFacultyToUpdate(null);
    fetchData();
  };

  const handleUpdate = (faculty: Faculty) => {
    openModal(true, faculty);
  };

  const handleDelete = (id: number) => {
    setFacultyToDelete(id);
    openConfirmModal();
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
            <h1 className="text-2xl font-bold">Faculty List</h1>
            <div>
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => openModal(false)}
              >
                Add Faculty
              </button>
            </div>
          </div>
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
                      onClick={() => handleUpdate(faculty)}
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        isUpdate={isUpdateMode}
        facultyToUpdate={facultyToUpdate}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteConfirmed}
      />
    </main>
  );
}
