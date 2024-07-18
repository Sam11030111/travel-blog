import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";

import { fetchUsers } from "../../utils/fetch";

const UsersTable = () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchAllUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="w-[80%] mx-auto">
      <div className="flex justify-end py-5">
        <Link to="/users/add">
          <Button variant="success">Add User</Button>
        </Link>
      </div>
      <div className="bg-[var(--navbarBg)] p-5 rounded-[10px] mb-5">
        <table className="w-full">
          <thead>
            <tr>
              <td className="p-[10px] font-bold text-lg">Name</td>
              <td className="p-[10px] font-bold text-lg">Email</td>
              <td className="p-[10px] font-bold text-lg">Role</td>
              <td className="p-[10px] font-bold text-lg">Action</td>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="p-[10px]">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.image || "/noavatar.png"}
                      alt="user image"
                      className="w-10 aspect-square object-cover rounded-full"
                    />
                    {user.name}
                  </div>
                </td>
                <td className="p-[10px]">{user.email}</td>
                <td className="p-[10px]">
                  <div className="flex items-center gap-2">
                    {user.isAdmin === 1 && (
                      <img
                        src="/crown.png"
                        className="w-5 aspect-square object-cover"
                      />
                    )}
                    {user.isAdmin === 1 ? "Admin" : "Normal"}
                  </div>
                </td>
                <td className="p-[10px]">
                  <div className="flex gap-2">
                    <Link to={`/users/${user.id}`}>
                      <Button variant="warning" size="sm">
                        View
                      </Button>
                    </Link>
                    <form>
                      <input type="hidden" name="id" />
                      <Button variant="danger" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
