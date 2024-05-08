"use client";
import React, { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import SideBar from "../../../../components/SideBar/SideBar";
import styles from "../table.module.scss";
import axios from "axios";
import Modal from "./Modal";
import ConfirmModal from "../../../../components/ConfirmModal/ConfirmModal";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number>();
  const [courseToUpdate, setCourseToUpdate] = useState<any | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response: any = await axios.get(`/api/course?adminId=${userId}`);
      setCourses(response?.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleUpdate = (course: any) => {
    setIsUpdateMode(true);
    setCourseToUpdate(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCourseToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.delete(`/api/course?adminId=${userId}`, {
        data: { id: courseToDelete },
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
    setCourseToUpdate(null);
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
            <h1 className="text-2xl font-bold">All Courses</h1>
            <div>
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Add Course
              </button>
            </div>
          </div>
          {courses.length > 0 ? (
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
                        onClick={() => handleUpdate(course)}
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
          ) : (
            <h1 className="text-2xl">
              There is currently no courses list available.
            </h1>
          )}
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        isUpdate={isUpdateMode}
        courseToUpdate={courseToUpdate}
      />
      <ConfirmModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
