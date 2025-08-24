import React, { useState, useEffect } from "react";
import {
  Avatar,
  Popover,
  Button,
  Tooltip,
  Flex,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import logo from "./../assets/logo.png";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminuser, setAdminuser] = useState(null);
  const navigate = useNavigate();

  // ✅ Check user login from localStorage when component loads
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminuser");
    if (storedAdmin) {
      try {
        setAdminuser(JSON.parse(storedAdmin));
      } catch (err) {
        console.error("Invalid adminuser data:", err);
        setAdminuser(null);
      }
    }
  }, []);

  // ✅ Search function
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  // ✅ Logout function
  const logout = () => {
    Modal.confirm({
      title: "Are you sure you want to log out?",
      content: "You will be logged out of your account.",
      okText: "Yes, Log out",
      cancelText: "Cancel",
      onOk: () => {
        localStorage.removeItem("adminuser");
        localStorage.removeItem("token");
        setAdminuser(null); // immediately update UI
        message.success("Logged out successfully!");
        navigate("/signin");
      },
      onCancel() {
        message.info("Log out canceled");
      },
    });
  };

  // ✅ Popover content for logged-in user
  const contentLoggedIn = (
    <div>
      <Button type="link" onClick={() => navigate("/profile")}>
        Your Profile
      </Button>
      <p />
      <Link to="/" style={{ textDecoration: "none" }} onClick={logout}>
        Log out
      </Link>
    </div>
  );

  // ✅ Popover content for not logged-in user
  const contentNotLoggedIn = (
    <div>
      <Link to="/Signup" style={{ textDecoration: "none" }}>
        Create Your Account
      </Link>
      <p />
      <Link to="/Signin" style={{ textDecoration: "none" }}>
        Log in Your Account
      </Link>
    </div>
  );

  return (
    <Row className="header">
      {/* Logo */}
      <Col xs={2} sm={4} md={6} lg={8} xl={10}>
        <div style={{ padding: "0 16px" }}>
          <Link to="/">
            <img alt="Logo" className="Logo" src={logo} />
          </Link>
        </div>
      </Col>

      {/* Search */}
      <Col flex="1 1 200px">
        <Flex gap="small" vertical>
          <Flex wrap gap="small">
            <Tooltip title="Search" className="Search">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Col>

      {/* Account Section */}
      <Row wrap={false}>
        <Col flex="none">
          <div style={{ padding: "0 16px" }}>
            <Popover
              placement="bottom"
              content={adminuser ? contentLoggedIn : contentNotLoggedIn}
            >
              <Avatar className="Account" icon={<UserOutlined />} />
            </Popover>
          </div>
        </Col>
      </Row>
    </Row>
  );
};

export default Header;
