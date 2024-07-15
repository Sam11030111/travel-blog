import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { fetchUsers } from "../../utils/fetch";
import { AuthContext } from "../../context/AuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiArrowRightCircle } from "react-icons/fi";

const SingleCard = ({ post, categories, onDelete }) => {
  const category = categories.find((cat) => cat.id === post.categoryId);
  const [user, setUser] = useState(null);
  const { auth } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const getUser = async () => {
      const users = await fetchUsers();
      const postUser = users.find((user) => user.id === post.userId);
      setUser(postUser);
    };

    getUser();
  }, [post.userId]);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/php/posts.php?id=${post.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      const data = await res.json();
      if (data.success) {
        console.log(data.message);
        onDelete(post.id);
        handleClose();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const isCurrentUser = auth.user?.id === post.userId;

  return (
    <>
      <Card
        style={{ width: "18rem" }}
        className="shadow-md bg-[var(--navbarBg)]"
      >
        {post.image ? (
          <>
            <Card.Img
              variant="top"
              src={post.image}
              className="w-full h-[250px] object-cover relative"
            />
            {isCurrentUser && (
              <p className="absolute bg-[var(--bg)] text-[var(--textColor)] top-2 right-2 rounded-md py-1 px-2">
                Your Post
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col border-b-2 border-[var(--bg)] h-[250px] items-center justify-center relative">
            {isCurrentUser && (
              <p className="absolute bg-[var(--bg)] text-[var(--textColor)] top-2 right-2 rounded-md py-1 px-2">
                Your Post
              </p>
            )}
            <img src="/no-picture.png" className="w-[100px]" />
            <p className="font-bold text-[var(--textColor)]">No image</p>
          </div>
        )}
        {(auth.user?.isAdmin === 1 || isCurrentUser) && (
          <Dropdown className="absolute top-0 left-0">
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <BsThreeDotsVertical className="text-[var(--textColor)]" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-[var(--bg)] text-[var(--textColor)]">
              <Link
                to={`/write/${post.id}`}
                className="w-full inline-block px-2"
              >
                EDIT
              </Link>
              <Dropdown.Divider />
              <button className="w-full text-left px-2" onClick={handleShow}>
                DELETE
              </button>
            </Dropdown.Menu>
          </Dropdown>
        )}
        <Card.Body className="text-[var(--textColor)] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img
              src={user?.image || "/noavatar.png"}
              className="w-10 aspect-square border-white border-2 rounded-full object-cover"
            />
            <Card.Title className="truncate">{post.title}</Card.Title>
          </div>
          <Card.Text className="bg-slate-500 w-max py-1 px-2 rounded-lg text-white border border-black">
            {category.title}
          </Card.Text>
          <Card.Text className="pl-1 truncate">{post.description}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush bg-[var(--navbarBg)]">
          <ListGroup.Item>{post.createdAt}</ListGroup.Item>
        </ListGroup>
        <Card.Body className="text-[var(--textColor)]">
          <Link
            to={`/explore/${post.id}`}
            className="card-link hover:border-b p-1 border-black flex items-center gap-2 w-max"
          >
            <FiArrowRightCircle className="text-xl" />
            <span>Details</span>
          </Link>
        </Card.Body>
      </Card>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-red-500">Danger</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the post?</Modal.Body>
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

export default SingleCard;
