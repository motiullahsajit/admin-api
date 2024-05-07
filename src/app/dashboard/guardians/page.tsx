"use client";
import React, { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import styles from "../table.module.scss";
import axios from "axios";
import Modal from "./Modal";
import ConfirmModal from "../../../../components/ConfirmModal/ConfirmModal";

export default function Guardians() {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [guardianToDelete, setGuardianToDelete] = useState<number>();
  const [guardianToUpdate, setGuardianToUpdate] = useState<any | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response: any = await axios.get(`/api/guardian?adminId=${userId}`);
      setGuardians(response?.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleUpdate = (guardian: any) => {
    setIsUpdateMode(true);
    setGuardianToUpdate(guardian);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setGuardianToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.delete(`/api/guardian?adminId=${userId}`, {
        data: { id: guardianToDelete },
      });
      alert(response.data.message);
      setIsConfirmationModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeModal = () => {
    setIsUpdateMode(false);
    setGuardianToUpdate(null);
    setIsModalOpen(false);
    fetchData();
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
            <h1 className="text-2xl font-bold">All Guardians</h1>
            <div>
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Add Guardian
              </button>
            </div>
          </div>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Username</th>
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
                  <td>{guardian.username}</td>
                  <td>{guardian.email}</td>
                  <td>{guardian.student_id}</td>
                  <td>{guardian.phone_number}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(guardian)}
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        isUpdate={isUpdateMode}
        guardianToUpdate={guardianToUpdate}
      />
      <ConfirmModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
