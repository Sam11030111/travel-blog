import { useState, useEffect, useRef } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { IoMdCloseCircle } from "react-icons/io";

import { uploadFile } from "../utils/firebase.js";

const SingleUser = () => {
  const { user } = useLoaderData();

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const nameRef = useRef();
  const [media, setMedia] = useState("");
  const [file, setFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(0);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current.value = user.email;
    nameRef.current.value = user.name;
    setMedia(user.image);
    setIsAdmin(user.isAdmin);
  }, []);

  useEffect(() => {
    file && uploadFile(file, setMedia);
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      userId: user.id,
      name: nameRef.current.value,
      email: emailRef.current.value,
      isAdmin,
      image: media,
    };

    if (
      isOpen &&
      passwordRef.current.value &&
      confirmPasswordRef.current.value
    ) {
      updateData.password = passwordRef.current.value;
      updateData.confirmPassword = confirmPasswordRef.current.value;
    }

    try {
      const res = await fetch("http://localhost:3000/php/authenticate.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await res.json();
      console.log(data);

      if (data.message) {
        navigate("/users");
      }

      if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.log("Failed to update user.");
      console.error("Error:", error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-10 w-[80%] sm:w-[600px] mx-auto my-5 bg-[var(--navbarBg)] rounded-xl flex flex-col sm:flex-row gap-5"
    >
      <div className="flex-1">
        <Row className="justify-center px-3 py-5 rounded-xl">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) => setFile(event.target.files[0])}
          />
          <button type="button" className="w-[150px] h-[150px]">
            <label htmlFor="image">
              <div className="relative inline-block">
                <img
                  src={media || "/noavatar.png"}
                  alt="user image"
                  className="rounded-full aspect-square object-cover border-white border-2"
                />
                {isAdmin === 1 && (
                  <img
                    width={30}
                    height={30}
                    src="/crown.png"
                    alt="crown image"
                    className="absolute top-[-25px] left-1/2 transform -translate-x-1/2"
                  />
                )}
              </div>
            </label>
          </button>
          <p className="text-center text-sm">(Upload Image)</p>
          <button
            type="button"
            className="flex items-center justify-center gap-1 cursor-pointer mt-2"
            onClick={() => setMedia("")}
          >
            <IoMdCloseCircle className="text-red-500" size={20} />
            Delete Image
          </button>
        </Row>
      </div>

      <div className="flex-3">
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter your email"
              ref={emailRef}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            placeholder="Enter your name"
            ref={nameRef}
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Sign up for Admin?</Form.Label>
            <Form.Select
              value={isAdmin}
              onChange={(event) => setIsAdmin(+event.target.value)}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <div className="flex justify-end mb-3">
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => setIsOpen(!isOpen)}
          >
            Change Password
          </button>
        </div>
        {isOpen && (
          <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Enter New Password"
                  ref={passwordRef}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  name="confirmpassword"
                  type="password"
                  placeholder="Enter New Password Again"
                  ref={confirmPasswordRef}
                />
              </Form.Group>
            </Row>
          </>
        )}

        {error && (
          <Alert className="mb-3" variant="danger">
            {error}
          </Alert>
        )}
        <Button variant="warning" type="submit" className="w-full">
          Update User
        </Button>
      </div>
    </Form>
  );
};

export default SingleUser;
