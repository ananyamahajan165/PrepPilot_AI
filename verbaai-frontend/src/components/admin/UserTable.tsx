import { Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import type { AdminUser } from "../../services/admin/admin.service";

interface UserTableProps {
  users: AdminUser[];
  onDelete: (id: string) => void;
}

const UserTable = ({ users, onDelete }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-500 text-sm">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">College</th>
            <th className="p-4">Role</th>
            <th className="p-4">Verified</th>
            <th className="p-4">Joined</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="p-4 font-medium">{user.name}</td>
              <td className="p-4 text-gray-600">{user.email}</td>
              <td className="p-4 text-gray-600">{user.college || "—"}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                {user.isVerified ? (
                  <ShieldCheck className="text-green-600" size={20} />
                ) : (
                  <ShieldOff className="text-gray-400" size={20} />
                )}
              </td>
              <td className="p-4 text-gray-500 text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => onDelete(user._id)}
                  className="text-red-500 hover:text-red-700 transition"
                  aria-label={`Delete ${user.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
