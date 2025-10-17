import React, { useState, useEffect, useMemo } from "react";
import Header from "./HeaderComponent";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import {
  ShopOutlined,
  LaptopOutlined,
  GiftOutlined,
  WalletOutlined,
  PlusOutlined,
  DownOutlined,
  UploadOutlined,
  PrinterOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import {
  Select,
  Table,
  Switch,
  Tag,
  Input,
  Button,
  Dropdown,
  Pagination,
  Row,
  Col,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const ProductList = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form] = Form.useForm();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);

      message.success("Delete Product SuccessFully");
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Cancel to Delete Product");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Refetch product list
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`,
          {
            params: {
              searchText,
              selectedCategory,
              selectedStock,
              selectedStatus,
              page: currentPage,
              limit: pageSize,
            },
          }
        );
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [
    searchText,
    selectedCategory,
    selectedStock,
    selectedStatus,
    currentPage,
    pageSize,
  ]);

  const stats = [
    {
      title: "In-store Sales",
      amount: "$5,345.43",
      orders: "5k orders",
      change: "+5.7%",
      changeColor: "#71dd37",
      bgColor: "rgba(113, 221, 55, 0.1)",
      icon: <ShopOutlined style={{ fontSize: "24px", color: "#4b4b4b" }} />,
    },
    {
      title: "Website Sales",
      amount: "$674,347.12",
      orders: "21k orders",
      change: "+12.4%",
      changeColor: "#71dd37",
      bgColor: "rgba(113, 221, 55, 0.1)",
      icon: <LaptopOutlined style={{ fontSize: "24px", color: "#4b4b4b" }} />,
    },
    {
      title: "Discount",
      amount: "$14,235.12",
      orders: "6k orders",
      change: null,
      icon: <GiftOutlined style={{ fontSize: "24px", color: "#4b4b4b" }} />,
    },
    {
      title: "Affiliate",
      amount: "$8,345.23",
      orders: "150 orders",
      change: "-3.5%",
      changeColor: "#ff3e1d",
      bgColor: "rgba(255, 62, 29, 0.1)",
      icon: <WalletOutlined style={{ fontSize: "24px", color: "#4b4b4b" }} />,
    },
  ];

  const filteredData = useMemo(() => {
    return products.filter((item) => {
      const productName = item.ProductName?.toLowerCase() || "";
      return (
        productName.includes(searchText.toLowerCase()) &&
        (selectedCategory ? item.Category === selectedCategory : true) &&
        (selectedStock === "In_Stock"
          ? item.Unit > 0
          : selectedStock === "Out_of_Stock"
          ? item.Unit === 0
          : true) &&
        (selectedStatus ? item.status === selectedStatus : true)
      );
    });
  }, [products, searchText, selectedCategory, selectedStock, selectedStatus]);

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
      width: 300,
      render: (text, record) => (
        <div className="product-info">
          <img
            src={`${import.meta.env.VITE_API_URL}/p_image/${record.MainImage}`}
            alt={record.ProductName}
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-placeholder.jpg";
            }}
          />
          <div className="product-details">
            <div className="product-title">{record.ProductName}</div>
            <div className="product-description">
              {record.ProductDescription}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "Category",
      width: 120,
      render: (category) => <Tag color="volcano">{category}</Tag>,
    },
    {
      title: "Stock",
      dataIndex: "Unit",
      key: "Unit",
      width: 100,
      render: (unit, record) => (
        <Switch
          checked={unit > 0}
          onChange={async (checked) => {
            const newUnit = checked ? 1 : 0;
            await axios.put(
              `${import.meta.env.VITE_API_URL}/api/products/${record.id}`,
              {
                Unit: newUnit,
              }
            );
            setProducts((prev) =>
              prev.map((p) =>
                p.id === record.id ? { ...p, Unit: newUnit } : p
              )
            );
          }}
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "Unit",
      key: "Unit",
      width: 80,
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      width: 100,
      render: (price) => (Array.isArray(price) ? price.join(", ") : price),
    },
    {
      title: "Discount",
      dataIndex: "discountpercentage",
      key: "discountpercentage",
      width: 120,
      render: (discountpercentage) =>
        Array.isArray(discountpercentage)
          ? discountpercentage.join(", ")
          : discountpercentage,
    },
    {
      title: "VariantsColor",
      dataIndex: "VariantsColor",
      key: "VariantsColor",
      width: 140,
      render: (VariantsColor) =>
        Array.isArray(VariantsColor) ? VariantsColor.join(", ") : VariantsColor,
    },
    {
      title: "VariantsSize",
      dataIndex: "VariantsSize",
      key: "VariantsSize",
      width: 140,
      render: (VariantsSize) =>
        Array.isArray(VariantsSize) ? VariantsSize.join(", ") : VariantsSize,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              console.log("Full record:", record); // Debug

              const rawExtraImages =
                record.ExtraImages || record.ExtraImage || "[]";

              setEditProduct({
                ...record,
                ExtraImages: JSON.parse(rawExtraImages || "[]").map(
                  (img, index) => ({
                    uid: index.toString(),
                    name: img,
                    status: "done",
                    url: `${import.meta.env.VITE_API_URL}/p_image/${img}`,
                  })
                ),
              });

              setIsEditModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the Item"
            description="Are you sure to delete this Item?"
            onConfirm={() => handleDelete(record.id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (editProduct) {
      form.setFieldsValue({
        ProductName: editProduct.ProductName,
        ProductDescription: editProduct.ProductDescription,
        Unit: editProduct.Unit,
        Category: editProduct.Category,
        ProductBrand: editProduct.ProductBrand,
        VariantsColor: editProduct.VariantsColor,
        VariantsSize: editProduct.VariantsSize,
        price: editProduct.Price,
        discountpercentage: editProduct.discountpercentage,
        ExtraImages: editProduct.ExtraImages,
      });
    }
  }, [editProduct]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form Values:", values); // Debugging: Check all form values

      const parsedColors = Array.isArray(values.VariantsColor)
        ? values.VariantsColor
        : values.VariantsColor.split(",").map((c) =>
            c.trim().replace(/^"|"$/g, "")
          );
      const parsedSizes = Array.isArray(values.VariantsSize)
        ? values.VariantsSize
        : values.VariantsSize.split(",").map((s) =>
            s.trim().replace(/^"|"$/g, "")
          );
      const parsedPrices = Array.isArray(values.price)
        ? values.price
        : values.price.split(",").map((p) => parseFloat(p.trim()));
      const parsedDiscounts = Array.isArray(values.discountpercentage)
        ? values.discountpercentage
        : values.discountpercentage.split(",").map((d) => parseFloat(d.trim()));

      const formData = new FormData();
      formData.append("ProductName", values.ProductName);
      formData.append("ProductDescription", values.ProductDescription);
      formData.append("Unit", values.Unit);
      formData.append("Category", values.Category);

      if (values.ProductBrand) {
        formData.append("ProductBrand", values.ProductBrand);
      }

      const newMainImageFile = values?.NewMainImage?.file?.originFileObj;

      // Main image validation
      if (!editProduct.MainImage && !newMainImageFile) {
        message.error("Main image is required");
        return;
      }

      // Append the existing main image if it's not a new one
      formData.append("existingMainImage", editProduct.MainImage || "");

      const currentExtraList = values?.ExtraImages || [];

      // Handling existing extra images
      const existingExtraImages = (editProduct.ExtraImages || []).map(
        (file) => file.name
      );

      console.log("existingExtraImages before filtering:", existingExtraImages);

      // New files (that are being uploaded)
      const newExtraFiles = currentExtraList.filter(
        (file) => file.originFileObj
      );

      // Append the existing extra images
      formData.append(
        "existingExtraImages",
        JSON.stringify(existingExtraImages)
      );

      // Log for debugging

      // Append parsed values to FormData
      formData.append("price", JSON.stringify(parsedPrices));
      formData.append("discountpercentage", JSON.stringify(parsedDiscounts));
      formData.append("VariantsColor", JSON.stringify(parsedColors));
      formData.append("VariantsSize", JSON.stringify(parsedSizes));

      // If there is a new main image, append it
      if (newMainImageFile) {
        formData.append("MainImage", newMainImageFile);
      }

      // Append new extra files (images)
      newExtraFiles.forEach((file) => {
        formData.append("ExtraImages", file.originFileObj);
      });

      // Log all form data for debugging purposes
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send the form data to the backend
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${editProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the local state after the product is successfully updated
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? {
                ...p,
                ...values,
                VariantsColor: parsedColors,
                VariantsSize: parsedSizes,
                Price: parsedPrices,
                discountpercentage: parsedDiscounts,
                ExtraImages: [
                  ...existingExtraImages,
                  ...newExtraFiles.map((f) => f.name),
                ],
              }
            : p
        )
      );

      setIsEditModalVisible(false);
      message.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product");
    }
  };

  const exportMenu = {
    items: [
      { key: "1", label: "Print", icon: <PrinterOutlined /> },
      { key: "2", label: "CSV", icon: <FileTextOutlined /> },
      { key: "3", label: "PDF", icon: <FilePdfOutlined /> },
      { key: "4", label: "Excel", icon: <FileExcelOutlined /> },
      { key: "5", label: "Copy", icon: <CopyOutlined /> },
    ],
  };

  return (
    <>
      <Header />
      <div style={{ display: "flex", height: "100%", Width: "100%" }}>
        <Sidebar />
        <div style={{ padding: "20px", maxWidth: "100%", overflowX: "auto" }}>
          {/* Stats Boxes */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {stats.map((item, index) => (
              <div
                key={index}
                style={{ display: "flex" }}
                className="productlist_box"
              >
                <div>
                  <p style={{ margin: "0 0 5px 0", color: "#5a5a5a" }}>
                    {item.title}
                  </p>
                  <h4 style={{ margin: "0 0 8px 0" }}>{item.amount}</h4>
                  <span
                    style={{
                      display: "block",
                      color: "#777",
                      marginBottom: "5px",
                    }}
                  >
                    {item.orders}
                  </span>
                  {item.change && (
                    <span
                      style={{
                        color: item.changeColor,
                        backgroundColor: item.bgColor,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        display: "inline-block",
                      }}
                    >
                      {item.change}
                    </span>
                  )}{" "}
                </div>
                <div className="productlist_box_icon">{item.icon}</div>
              </div>
            ))}
          </div>

          {/* Filter & Table */}
          <div className="productlist_content_table">
            <div>
              <h4>Filter</h4>
              <div
                style={{
                  paddingBottom: "20px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Select
                  name="Category"
                  placeholder="Select Category"
                  style={{
                    width: "280px",
                    margin: "20px",
                    marginBottom: "0px",
                  }}
                  value={selectedCategory || undefined}
                  onChange={(value) => {
                    setSelectedCategory(value);
                    setCurrentPage(1);
                  }}
                  allowClear
                >
                  {[
                    "Mobiles",
                    "Laptops",
                    "TVs",
                    "Cameras",
                    "Watches",
                    "Headphones",
                    "Airbuds",
                    "Computers",
                    "Speakers",
                    "Power Banks",
                  ].map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Stock"
                  style={{
                    width: "280px",
                    margin: "20px",
                    marginBottom: "0px",
                  }}
                  value={selectedStock || undefined}
                  onChange={(value) => {
                    setSelectedStock(value);
                    setCurrentPage(1);
                  }}
                  allowClear
                >
                  <Option value="Out_of_Stock">Out of Stock</Option>
                  <Option value="In_Stock">In Stock</Option>
                </Select>
              </div>
            </div>
            <h4 style={{ margin: "20px 0" }}>Products</h4>
            {/* Filter & Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              <Input
                placeholder="Search Product"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ width: "250px", borderRadius: "8px" }}
              />

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Select
                  defaultValue={pageSize}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setPageSize(value);
                    setCurrentPage(1);
                  }}
                >
                  <Option value={5}>5</Option>
                  <Option value={10}>10</Option>
                  <Option value={20}>20</Option>
                  <Option value={50}>50</Option>
                  <Option value={100}>100</Option>
                </Select>

                <Dropdown menu={exportMenu} trigger={["click"]}>
                  <Button icon={<UploadOutlined />}>
                    Export <DownOutlined />
                  </Button>
                </Dropdown>

                <Link to="/add-product">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{
                      background: "#1a1a1a",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Add Product
                  </Button>
                </Link>
              </div>
            </div>
            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <Table
                loading={loading}
                columns={columns}
                dataSource={filteredData
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((item, index) => ({
                    ...item,
                    key: item.id || `${item.ProductName}-${index}`,
                  }))}
                pagination={false}
                scroll={{ x: "max-content" }} // Enables horizontal scroll
              />
            </div>
            {/* console.log(
                    "editProduct.ExtraImages:",
                    editProduct.ExtraImages
                  ); */}
            <Modal
              title="Edit Product"
              open={isEditModalVisible}
              onCancel={() => setIsEditModalVisible(false)}
              onOk={onOk}
              okText="Save"
            >
              <Form layout="vertical" form={form}>
                <Form.Item
                  label="ProductName"
                  name="ProductName"
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="ProductDescription"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter product description",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Product Description" />
                </Form.Item>
                <Form.Item
                  name="ProductBrand"
                  label="Brand"
                  rules={[{ required: true, message: "Please enter brand" }]}
                >
                  <Input placeholder="Brand Name" />
                </Form.Item>
                <Form.Item
                  name="Category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select Category" },
                  ]}
                >
                  <Select placeholder="Select Category">
                    {[
                      "Mobiles",
                      "Laptops",
                      "TVs",
                      "Cameras",
                      "Watches",
                      "Headphones",
                      "Airbuds",
                      "Computers",
                      "Speakers",
                      "Power Banks",
                    ].map((cat) => (
                      <Option key={cat} value={cat}>
                        {cat}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Quantity"
                  name="Unit"
                  rules={[{ required: true, message: "Quantity is required" }]}
                >
                  <Input type="number" />
                </Form.Item>
                {/* Variants */}
                <Form.Item
                  name="VariantsColor"
                  label="VariantsColor"
                  rules={[
                    {
                      required: true,
                      message: "Please enter VariantsColor(s)",
                    },
                  ]}
                >
                  <Input placeholder="e.g. Black, White" />
                </Form.Item>

                <Form.Item
                  name="VariantsSize"
                  label="VariantsSize"
                  rules={[
                    {
                      required: true,
                      message: "Please enter VariantsSize options",
                    },
                  ]}
                >
                  <Input placeholder="e.g. 1TB, 512GB" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="price"
                      label="Base Price"
                      rules={[
                        { required: true, message: "Please enter price" },
                      ]}
                    >
                      <Input placeholder="Price" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="discountpercentage"
                      label="Discount Percentage"
                      rules={[
                        { required: true, message: "Please enter discount" },
                      ]}
                    >
                      <Input
                        placeholder="Discount Percentage"
                        min={0}
                        max={100}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <span style={{ color: "#a1a1aa", fontSize: "14px" }}>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
                {filteredData.length} products
              </span>

              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductList;
