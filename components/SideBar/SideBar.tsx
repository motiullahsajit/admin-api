"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");

    router.push("/login");
  };
  return (
    <section className={styles.sidebar}>
      <div>
        <ul className={styles["sidebar-list"]}>
          <li className={styles["sidebar-list-item"]}>
            <Link className={styles["sidebar-link"]} href="/dashboard">
              Profile
            </Link>
          </li>
          <li className={styles["sidebar-list-item"]}>
            <Link className={styles["sidebar-link"]} href="/dashboard/faculty">
              Manage Faculty
            </Link>
          </li>
          <li className={styles["sidebar-list-item"]}>
            <Link className={styles["sidebar-link"]} href="/dashboard/courses">
              Manage Courses
            </Link>
          </li>
          <li className={styles["sidebar-list-item"]}>
            <Link className={styles["sidebar-link"]} href="/dashboard/students">
              Manage Students
            </Link>
          </li>
          <li className={styles["sidebar-list-item"]}>
            <Link
              className={styles["sidebar-link"]}
              href="/dashboard/guardians"
            >
              Manage Guardians
            </Link>
          </li>
          <li className={styles["sidebar-list-item"]}>
            <Link
              className={styles["sidebar-link"]}
              href="/login"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Sidebar;
