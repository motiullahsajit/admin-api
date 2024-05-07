"use client";
import Profile from "../../../components/Profile/Profile";
import SideBar from "../../../components/SideBar/SideBar";

export default function Dashboard() {
  return (
    <main className="flex">
      <SideBar />
      <Profile />
    </main>
  );
}
