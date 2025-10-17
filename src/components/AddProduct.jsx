import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import React from "react";
import axios from "axios";
import { Col, Form, Input, Row, Upload, Button, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddProduct = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("ProductName", values.ProductName);
    formData.append("category", values.category);
    formData.append("Unit", values.Unit);
    formData.append("ProductBrand", values.ProductBrand);
    formData.append("ProductDescription", values.ProductDescription);

    // Handle multiple prices (split by commas and map each price)
    const priceArray =
      values.price?.split(",").map((price) => price.trim()) || [];
    formData.append("price", JSON.stringify(priceArray)); // Pass array of prices

    // Handle multiple discount percentages (split by commas and map each discount)
    const discountpercentageArray =
      values.discountpercentage
        ?.split(",")
        .map((discountpercentage) => discountpercentage.trim()) || [];
    formData.append(
      "discountpercentage",
      JSON.stringify(discountpercentageArray)
    ); // Pass array of discounts

    // Handle color and size arrays
    const colorArray =
      values.VariantsColor?.split(",").map((color) => color.trim()) || [];
    formData.append("VariantsColor", JSON.stringify(colorArray));

    const sizeArray =
      values.VariantsSize?.split(",").map((size) => size.trim()) || [];
    formData.append("VariantsSize", JSON.stringify(sizeArray));

    // Handle file uploads
    if (values.MainImage?.[0]?.originFileObj) {
      formData.append("MainImage", values.MainImage[0].originFileObj);
    }

    if (values.ExtraImages) {
      values.ExtraImages.forEach((file) =>
        formData.append("ExtraImages", file.originFileObj)
      );
    }

    console.log("FormData Content:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/addProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      message.success("Product added successfully!");

      // Reset the form after successful submission
      form.resetFields();
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      alert("Error adding product. Please try again.");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return (
      e?.fileList?.map((file) => ({
        ...file,
        uid: file.uid || Date.now(), // Ensure uid exists
        originFileObj: file.originFileObj,
      })) || []
    );
  };

  return (
    <>
      <HeaderComponent />
      <div className="body_Add_Product">
        <div style={{ width: "19.5%" }}>
          <Sidebar />
        </div>
        <div
          className="AddProduct_maincontent"
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            {/* Header */}
            <div className="Addprouct_topcontent1">
              <div>
                <h4>Add a new Product</h4>
                <p>Orders placed across your store</p>
              </div>
              <div>
                <Button
                  onClick={() => form.resetFields()}
                  style={{ margin: "10px" }}
                >
                  Discard
                </Button>
                <Button
                  style={{ margin: "10px" }}
                  type="primary"
                  htmlType="submit"
                >
                  Publish product
                </Button>
              </div>
            </div>
            <Row
              gutter={16}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Left Section */}
              <Col
                span={12}
                style={{ padding: "15px", borderRight: "1px solid #ddd" }}
              >
                <Form.Item
                  name="ProductName"
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter product name" },
                  ]}
                >
                  <Input placeholder="Product title" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="Unit"
                      label="Unit"
                      rules={[{ required: true, message: "Please enter unit" }]}
                    >
                      <Input placeholder="Unit" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="ProductBrand"
                      label="Brand"
                      rules={[
                        { required: true, message: "Please enter brand" },
                      ]}
                    >
                      <Input placeholder="Brand Name" />
                    </Form.Item>
                  </Col>
                </Row>
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
                  label="Product Main Image"
                  name="MainImage"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload.Dragger
                    beforeUpload={(file) => {
                      file.uid = file.uid || Date.now(); // Assign UID
                      return false; // Prevent auto-upload
                    }}
                    listType="picture"
                  >
                    <UploadOutlined /> Drag & Drop or Browse Image
                  </Upload.Dragger>
                </Form.Item>

                <Form.Item
                  label="Product Extra Images"
                  name="ExtraImages"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload.Dragger beforeUpload={() => false} listType="picture">
                    <UploadOutlined /> Drag & Drop or Browse Image
                  </Upload.Dragger>
                </Form.Item>
              </Col>
              {/* Right Section */}
              <Col span={12} style={{ padding: "15px" }}>
                <Form.Item
                  name="price"
                  label="Base Price"
                  rules={[{ required: true, message: "Please enter price" }]}
                >
                  <Input placeholder="Price" />
                </Form.Item>
                <Form.Item
                  name="discountpercentage"
                  label="Discount Percentage"
                  rules={[{ required: true, message: "Please enter discount" }]}
                >
                  <Input placeholder="Discount Percentage" />
                </Form.Item>

                {/* Variants */}
                <div className="Add_product_row1_1">
                  <h5>Variants</h5>
                  <Form.Item
                    name="VariantsColor"
                    label="Color"
                    rules={[
                      { required: true, message: "Please enter color(s)" },
                    ]}
                  >
                    <Input placeholder="e.g. Black, White" />
                  </Form.Item>

                  <Form.Item
                    name="VariantsSize"
                    label="Storage"
                    rules={[
                      {
                        required: true,
                        message: "Please enter storage options",
                      },
                    ]}
                  >
                    <Input placeholder="e.g. 1TB, 512GB" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select category" },
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
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AddProduct;
