import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../../APIRoutes";
import { useHistory, Link } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Form from "../../ui/Form";

export const localStorage_key = "Pro-Gram";

const Register = (props) => {

 
  const history = useHistory();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoadingState, setLoadingState] = useState(false);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      setLoadingState(true);
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      setLoadingState(false);
      if (data.status === true) {
        localStorage.setItem(localStorage_key, JSON.stringify(data.user));
        props.onsetislogged();
        history.push("/home");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={handleChange}
        />
        <Button disabled={isLoadingState ? true : false} type="submit">
          {isLoadingState ? "...Loading" : "Create User"}
        </Button>
        <span className="text-[10px] block text-center mt-4">
          Already have an account?{" "}
          <Link className="font-semibold text-blue-600" to="/login">
            Login
          </Link>
        </span>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Register;
