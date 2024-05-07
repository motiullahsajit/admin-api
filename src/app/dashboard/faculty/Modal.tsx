import axios from "axios";
import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, isUpdate, facultyToUpdate }: any) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isUpdate && facultyToUpdate) {
      setName(facultyToUpdate.name);
      setUsername(facultyToUpdate.username);
      setEmail(facultyToUpdate.email);
      setPhoneNumber(facultyToUpdate.phone_number);
      setQualifications(facultyToUpdate.qualifications);
      setDepartmentId(facultyToUpdate.department_id);
      setCourses(facultyToUpdate.courses);
    } else {
      setName("");
      setUsername("");
      setEmail("");
      setPhoneNumber("");
      setQualifications("");
      setDepartmentId("");
      setCourses([]);
      setPassword("");
    }
  }, [isUpdate, facultyToUpdate]);

  const handleSubmit = async (event: React.FormEvent) => {
    const userId = localStorage.getItem("userId");
    event.preventDefault();
    const facultyData = {
      id: facultyToUpdate?.id,
      name,
      username,
      email,
      password,
      qualifications,
      department_id: departmentId,
      courses,
      phone_number: phoneNumber,
    };

    try {
      if (isUpdate) {
        const response = await axios.put(
          `/api/faculty?adminId=${userId}`,
          facultyData
        );
        alert(response.data.message);
      } else {
        const response = await axios.post(
          `/api/faculty?adminId=${userId}`,
          facultyData
        );
        alert(response.data.message);
      }
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
            {isUpdate ? "Update Faculty" : "Add Faculty"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter phone number"
                required
              />
            </div>
            {!isUpdate && (
              <div className="mb-4">
                <label htmlFor="password" className="block font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter password"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="qualifications"
                className="block font-semibold mb-1"
              >
                Qualifications
              </label>
              <input
                type="text"
                id="qualifications"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter qualifications"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="departmentId"
                className="block font-semibold mb-1"
              >
                Department ID
              </label>
              <input
                type="text"
                id="departmentId"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter department ID"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courses" className="block font-semibold mb-1">
                Courses
              </label>
              <input
                type="text"
                id="courses"
                value={courses.join(",")}
                onChange={(e) => setCourses(e.target.value.split(","))}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter courses (comma-separated)"
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
