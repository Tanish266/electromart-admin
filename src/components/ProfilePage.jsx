import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ use "adminuser" instead of "user"
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("adminuser"));
    setUser(loggedUser);
    if (loggedUser) form.setFieldsValue(loggedUser);
  }, [form]);

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const userId = user.id;
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin-users/${userId}`,
        values
      );
      message.success("Profile updated successfully!");

      // ✅ Update localStorage with new values
      const updatedUser = { ...user, ...values };
      localStorage.setItem("adminuser", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      message.error(error.response?.data?.error || "Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div style={{ padding: 30 }}>Please login to view your profile.</div>
    );

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Your Profile</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        initialValues={user}
      >
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Gender" name="gender">
          <Input />
        </Form.Item>
        <Form.Item label="Birth Date" name="birthDate">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;
