import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Lottie from "react-lottie";
import animationData from "../lotties/bus.json";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

const Login = () => {
  const { login } = useContext(AuthContext);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/php/authenticate.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          login: true,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }),
      });
      const data = await res.json();

      console.log(data);
      if (data.user) {
        login(data.user);
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login error. Please try again.");
    }
  };

  return (
    <Form
      className="p-10 w-[80%] sm:w-[400px] mx-auto mt-[100px] bg-[var(--navbarBg)] rounded-xl"
      onSubmit={handleSubmit}
    >
      <Row className="mb-3">
        <Lottie options={defaultOptions} height={150} width={200} />
      </Row>
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
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Enter your Password"
            ref={passwordRef}
          />
        </Form.Group>
      </Row>
      {error && (
        <Alert className="mb-3" variant="danger">
          {error}
        </Alert>
      )}
      <Button variant="primary" type="submit" className="w-full">
        Login
      </Button>
    </Form>
  );
};

export default Login;
