import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { fetchUsers } from "../../utils/fetch";
import { AuthContext } from "../../context/AuthContext";

const UsersTable = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState();
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setUserId(id);
    setShow(true);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };

    fetchAllUsers();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/php/users.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete user.");
      }

      const data = await res.json();
      if (data.message) {
        console.log(data.message);
      }

      // Remove the user from the state after successful deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
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
                      {auth.user?.id !== user.id && (
                        <form>
                          <input type="hidden" name="id" />
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleShow(user.id)}
                          >
                            Delete
                          </Button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-red-500">Danger</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            DELETE
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersTable;
