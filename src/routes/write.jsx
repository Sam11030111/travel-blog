import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLoaderData, useParams, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { IoMdCloseCircle } from "react-icons/io";
import Lottie from "react-lottie";
import animationData from "../lotties/share.json";
import { AuthContext } from "../context/AuthContext.jsx";
import { uploadFile } from "../utils/firebase.js";
import PlaceInput from "../components/placeInput/PlaceInput.jsx";

const Write = () => {
  const { auth } = useContext(AuthContext);
  const { categories, post } = useLoaderData();
  const navigate = useNavigate();
  const { postId } = useParams();

  const titleRef = useRef();
  const descriptionRef = useRef();
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (post && postId) {
      titleRef.current.value = post?.title;
      descriptionRef.current.value = post?.description;
      setCategoryId(post?.categoryId);
      setMedia(post?.image);
      setPlaceId(post?.placeId);
      setIsEdit(true);
    } else {
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      setCategoryId("");
      setMedia("");
      setPlaceId("");
      setIsEdit(false);
    }
  }, [post, postId]);

  useEffect(() => {
    file && uploadFile(file, setMedia);
  }, [file]);

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
      const res = await fetch("http://localhost:3000/php/posts.php", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post?.id,
          userId: auth.user.id,
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          image: media,
          categoryId,
          placeId,
        }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await res.json();

      if (data.success) {
        console.log(data.message);
        navigate("/explore");
      }

      if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error("Failed to submit post:", error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-10 w-[80%] sm:w-[600px] mx-auto my-[60px] bg-[var(--navbarBg)] rounded-xl relative"
    >
      <div className="absolute top-[-60px] left-[-90px]">
        <Lottie options={defaultOptions} height={150} width={200} />
      </div>
      <h1 className="text-5xl font-bold mb-5 font-dancing-script text-center">
        Share your travel tips
      </h1>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" name="title" ref={titleRef} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          ref={descriptionRef}
        />
      </Form.Group>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label className="mb-2">Image</Form.Label>
        {media && (
          <div className="relative mb-3">
            <img
              src={media || post?.image}
              className="w-[100px] aspect-square object-cover rounded-lg"
            />
            <IoMdCloseCircle
              className="absolute top-[-10px] left-[-10px] text-red-500 cursor-pointer"
              size={20}
              onClick={() => setMedia("")}
            />
          </div>
        )}
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files[0])}
          name="image"
        />
      </Form.Group>
      <Form.Group as={Col} controlId="formGridState" className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <PlaceInput setPlaceId={setPlaceId} />
      <div id="place"></div>
      {error && (
        <Alert className="mb-3" variant="danger">
          {error}
        </Alert>
      )}
      <Button
        variant={isEdit ? "success" : "primary"}
        type="submit"
        className="w-full"
      >
        {isEdit ? "Update" : "Share"}
      </Button>
    </Form>
  );
};

export default Write;
