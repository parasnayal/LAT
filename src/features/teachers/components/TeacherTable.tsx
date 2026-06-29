import styles from "./teachers.module.scss";
import type { Teacher } from "../types/teacher.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function TeacherTable({ teachers }: { teachers: Teacher[] }) {
  if (teachers.length === 0) {
    return <div className={styles.empty}>No teachers found for the selected filters.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Region</th>
            <th>School</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.teacherName}</td>
              <td>{teacher.userName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.contactNumber}</td>
              <td>{teacher.region}</td>
              <td>{teacher.school}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
