import styles from "./students.module.scss";
import type { Student } from "../types/student.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function StudentTable({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return <div className={styles.empty}>No students found for the selected filters.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>DOB</th>
            <th>Grade</th>
            <th>Roll Number</th>
            <th>Mobile Number</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>{formatDate(student.dob)}</td>
              <td>{student.grade}</td>
              <td>{student.rollNumber}</td>
              <td>{student.mobileNumber || "Not provided"}</td>
              <td>{formatDate(student.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
