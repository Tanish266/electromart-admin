import React, { useState } from "react";
import {
  Avatar,
  Popover,
  Button,
  Tooltip,
  Flex,
  Drawer,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import logo from "./../assets/logo.png";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      console.log("Searching for:", searchQuery);
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const logout = () => {
    Modal.confirm({
      title: "Are you sure you want to log out?",
      content: "You will be logged out of your account.",
      okText: "Yes, Log out",
      cancelText: "Cancel",
      onOk: () => {
        localStorage.removeItem("adminuser");
        localStorage.removeItem("token");
        message.success("Logged out successfully!");
        navigate("/signin");
      },
      onCancel() {
        message.info("Log out canceled");
      },
    });
  };

  // const adminuser = localStorage.getItem("adminuser");
  // Parse the stored JSON string
  const adminuser = JSON.parse(localStorage.getItem("adminuser") || "null");
  console.log("Admin User:", adminuser);
  console.log("Admin User Type:", typeof adminuser);

  // Content for logged-in adminuser
  const contentLoggedIn = (
    <div>
      <Link to="/Your-Account" style={{ textDecoration: "none" }}>
        Your-Account
      </Link>
      <p />
      <Link to="/" style={{ textDecoration: "none" }} onClick={logout}>
        Log out
      </Link>
    </div>
  );

  // Content for not logged-in adminuser
  const contentNotLoggedIn = (
    <div>
      <Link to="/Signup" style={{ textDecoration: "none" }}>
        create Your Account
      </Link>
      <p />
      <Link to="/SignIn" style={{ textDecoration: "none" }}>
        Log in Your Account
      </Link>
    </div>
  );

  // const content = (
  //   <div>
  //     <Link to="/Your-Account" style={{ textDecoration: "none" }}>
  //       Your-Account
  //     </Link>
  //     <p />
  //     <Link to="/Signup" style={{ textDecoration: "none" }}>
  //       create Your Account
  //     </Link>
  //     <p />
  //     <Link to="/SignIn" style={{ textDecoration: "none" }}>
  //       Log in Your Account
  //     </Link>
  //   </div>
  // );
  return (
    <>
      <Row className="header">
        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          <div
            style={{
              padding: "0 16px",
            }}
          >
            {/* Logo */}

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
                ></input>
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
        <Row wrap={false}>
          <Col flex="none">
            <div style={{ padding: "0 16px" }}>
              {/* Account */}
              {adminuser ? (
                <Popover placement="bottom" content={contentLoggedIn}>
                  <Avatar className="Account" icon={<UserOutlined />} />
                </Popover>
              ) : (
                <Popover placement="bottom" content={contentNotLoggedIn}>
                  <Avatar className="Account" icon={<UserOutlined />} />
                </Popover>
              )}
            </div>
          </Col>
        </Row>
      </Row>
    </>
  );
};
export default Header;
