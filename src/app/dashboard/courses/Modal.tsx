import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ isOpen, onClose, isUpdate, courseToUpdate }: any) => {
  const [name, setName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [credit, setCredit] = useState("");
  const [courseOutline, setCourseOutline] = useState("");

  useEffect(() => {
    if (isUpdate && courseToUpdate) {
      setName(courseToUpdate.name);
      setCourseCode(courseToUpdate.course_code);
      setDescription(courseToUpdate.description);
      setCredit(courseToUpdate.credit);
      setCourseOutline(courseToUpdate.course_outline);
    } else {
      setName("");
      setCourseCode("");
      setDescription("");
      setCredit("");
      setCourseOutline("");
    }
  }, [isUpdate, courseToUpdate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const courseData = {
      id: courseToUpdate?.id,
      name,
      course_code: courseCode,
      description,
      credit,
      course_outline: courseOutline,
    };

    try {
      const userId = localStorage.getItem("userId");
      let response;
      if (isUpdate) {
        response = await axios.put(`/api/course?adminId=${userId}`, courseData);
      } else {
        response = await axios.post(
          `/api/course?adminId=${userId}`,
          courseData
        );
      }
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative bg-white w-full max-w-md p-6 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800"
          >
            X
          </button>
          <h2 className="text-2xl font-bold mb-4">
            {isUpdate ? "Update Course" : "Add Course"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                className="border border-gray-300 p-2 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Course Code
              </label>
              <input
                type="text"
                className="border border-gray-300 p-2 w-full"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="border border-gray-300 p-2 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Credit
              </label>
              <input
                type="number"
                className="border border-gray-300 p-2 w-full"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Course Outline
              </label>
              <textarea
                className="border border-gray-300 p-2 w-full"
                value={courseOutline}
                onChange={(e) => setCourseOutline(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gray-800 text-white font-bold py-2 px-4 rounded w-full"
            >
              {isUpdate ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
