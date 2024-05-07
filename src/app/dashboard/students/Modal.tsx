import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ isOpen, onClose, isUpdate, studentToUpdate }: any) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guardianId, setGuardianId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (isUpdate && studentToUpdate) {
      setName(studentToUpdate.name);
      setUsername(studentToUpdate.username);
      setEmail(studentToUpdate.email);
      setGuardianId(studentToUpdate.guardian_id);
      setPhoneNumber(studentToUpdate.phone_number);
      setAddress(studentToUpdate.address);
      setDepartment(studentToUpdate.department);
    } else {
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setGuardianId("");
      setPhoneNumber("");
      setAddress("");
      setDepartment("");
    }
  }, [isUpdate, studentToUpdate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const studentData = {
      id: studentToUpdate?.id,
      name,
      username,
      email,
      password,
      guardian_id: guardianId,
      phone_number: phoneNumber,
      address,
      department,
    };

    try {
      const userId = localStorage.getItem("userId");
      let response;
      if (isUpdate) {
        response = await axios.put(
          `/api/student?adminId=${userId}`,
          studentData
        );
      } else {
        response = await axios.post(
          `/api/student?adminId=${userId}`,
          studentData
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
            {isUpdate ? "Update Student" : "Add Student"}
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
              <label htmlFor="guardianId" className="block font-semibold mb-1">
                Guardian ID
              </label>
              <input
                type="text"
                id="guardianId"
                value={guardianId}
                onChange={(e) => setGuardianId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter guardian ID"
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
            <div className="mb-4">
              <label htmlFor="address" className="block font-semibold mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter address"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="department" className="block font-semibold mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter department"
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
