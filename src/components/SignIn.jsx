import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import logo from "./../assets/logo.png";
import { Button, Checkbox, Form, Input, Flex, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [adminuser, setadminUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedadminUser = localStorage.getItem("adminuser");
    const storedToken = localStorage.getItem("token");

    console.log("Stored user data:", storedadminUser);
    console.log("Stored token:", storedToken);

    if (storedadminUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedadminUser);

        // Check token validity
        const tokenExpiration = JSON.parse(atob(storedToken.split(".")[1])).exp;
        if (Date.now() >= tokenExpiration * 1000) {
          localStorage.removeItem("adminuser");
          localStorage.removeItem("token");
          message.error("Session expired. Please log in again.");
        } else {
          setadminUser(parsedUser);
        }
      } catch (error) {
        console.error("Invalid user data or token in localStorage:", error);
        localStorage.removeItem("adminuser");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Handle form submission (login)
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/adminlogin`,
        { email, password }
      );

      console.log("Raw login response:", response.data);

      if (response.data.success) {
        const { adminuser, token } = response.data;

        // Check if adminuser and token are properly received
        if (adminuser && token) {
          localStorage.setItem("adminuser", JSON.stringify(adminuser));
          localStorage.setItem("token", token);

          message.success("Login successful!");
          setadminUser(adminuser);
          navigate("/");
        } else {
          message.error("Failed to retrieve user data.");
        }
      } else {
        message.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        message.error(error.response.data?.message || "Invalid credentials");
      } else {
        message.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f1f3f6", margin: "0px 400px" }}>
      <center>
        <Link to="/">
          <img
            className="Logo"
            style={{ margin: "5px" }}
            src={logo}
            alt="Logo"
          />
        </Link>
        <hr />
        <br />

        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Typography.Link to="/forgot-password">
                Forgot password?
              </Typography.Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            or <Link to="/Signup">Register now!</Link>
          </Form.Item>
        </Form>
      </center>
    </div>
  );
};

export default SignIn;
