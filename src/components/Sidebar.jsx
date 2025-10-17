import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  {
    key: "1",
    label: "Dashboard",
    link: "/dashboard",
  },
  {
    key: "2",
    label: "Product List",
    link: "/product-list",
  },
  {
    key: "3",
    label: "Add Product",
    link: "/add-product",
  },
  {
    key: "4",
    label: "Order List",
    link: "/order-list",
  },
];

const findKeyByPath = (items, path) => {
  for (let item of items) {
    if (item.link === path) return item.key;
    if (item.children) {
      const childKey = findKeyByPath(item.children, path);
      if (childKey) return childKey;
    }
  }
  return null;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    setSelectedKey(findKeyByPath(items, location.pathname));
  }, [location.pathname]);

  const onClick = ({ key }) => {
    const findLink = (items) => {
      for (let item of items) {
        if (item.key === key) return item.link;
        if (item.children) {
          const childLink = findLink(item.children);
          if (childLink) return childLink;
        }
      }
      return null;
    };

    const path = findLink(items);
    if (path) navigate(path);
  };

  return (
    <div style={{ width: 256, paddingTop: 20 }}>
      <Menu
        onClick={onClick}
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["2", "3"]} // Expand menus by default
        style={{ borderRight: "none" }}
        items={items}
      />
    </div>
  );
};

export default Sidebar;
