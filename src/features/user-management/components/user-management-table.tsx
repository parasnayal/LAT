import type { ManagedUser } from "../types/user-management.types";

const users: ManagedUser[] = [
  {
    id: "usr_1",
    name: "Avery Stone",
    email: "avery@example.com",
    role: "admin",
    status: "active"
  },
  {
    id: "usr_2",
    name: "Maya Patel",
    email: "maya@example.com",
    role: "manager",
    status: "invited"
  }
];

export function UserManagementTable() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">User management</h1>
      <div className="mt-6 overflow-hidden rounded-md border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3 capitalize">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
