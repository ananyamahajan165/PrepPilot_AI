import { useEffect, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import UserTable from "../../components/admin/UserTable";

import AdminService, {
  type AdminUser,
} from "../../services/admin/admin.service";

const Users = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await AdminService.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar title="Users" />

        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading...
            </div>
          ) : (
            <UserTable users={users} onDelete={handleDelete} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;
