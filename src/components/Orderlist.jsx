import Header from "./HeaderComponent";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import {
  CalendarOutlined,
  CheckOutlined,
  WalletOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  PlusCircleFilled,
  DownOutlined,
  UploadOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Tag,
  Space,
  Button,
  Dropdown,
  Pagination,
  Select,
  Drawer,
  Steps,
} from "antd";
import { debounce } from "lodash";
import axios from "axios";

const stats = [
  { orders: "56", title: "Pending Payment", icon: <CalendarOutlined /> },
  { orders: "12,689", title: "Completed", icon: <CheckOutlined /> },
  { orders: "124", title: "Refunded", icon: <WalletOutlined /> },
  { orders: "32", title: "Failed", icon: <ExclamationCircleOutlined /> },
];

const exportItems = [
  { key: "1", label: "Print", icon: <PrinterOutlined /> },
  { key: "2", label: "CSV", icon: <FileTextOutlined /> },
  { key: "3", label: "PDF", icon: <FilePdfOutlined /> },
  { key: "4", label: "Excel", icon: <FileExcelOutlined /> },
  { key: "5", label: "Copy", icon: <CopyOutlined /> },
];

const Orderlist = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const STATUS_COLORS = {
    Pending: "gold",
    Failed: "red",
    Cancelled: "gray",
    Paid: "green",
    Delivered: "green",
    "Out for Delivery": "blue",
    Dispatched: "orange",
    Returned: "red",
  };

  const ORDER_STATUS_STEP = {
    "Order Placed": 0,
    "Order Processed": 1,
    Packed: 2,
    Dispatched: 3,
    "Out for Delivery": 4,
    Delivered: 5,
    Cancelled: 6,
  };
  const ORDER_STATUS_PAYMENT = {
    Pending: 0,
    Paid: 1,
    Returned: 2,
  };

  const getStatusColor = (status) => STATUS_COLORS[status];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        window.location.href = "/SingIn";
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && Array.isArray(response.data.orders)) {
          // Ensure orders are sorted by 'id' in ascending order (1st ID first)
          const sortedOrders = response.data.orders.sort((a, b) => a.id - b.id);
          console.log("response.data.orders", response.data.orders);

          // Update the state with sorted orders
          setData(sortedOrders);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        if (error.response && error.response.status === 401) {
          window.location.href = "/SingIn";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchText(value.toLowerCase());
        setCurrentPage(1);
      }, 300),
    []
  );

  const handleSearch = useCallback(
    (e) => debouncedSearch(e.target.value),
    [debouncedSearch]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      [
        item.id,
        item.createdAt,
        item.customer_name,
        item.customer_email,
        item.payment_status,
        item.order_status,
      ].some((field) => field?.toString().toLowerCase().includes(searchText))
    );
  }, [data, searchText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const columns = [
    {
      title: "",
      render: (_, record) => (
        <PlusCircleFilled
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedOrder(record);
            setDrawerVisible(true);
          }}
        />
      ),
    },
    {
      title: "ORDER",
      dataIndex: "id",
      render: (id) => <strong>#{id}</strong>,
    },
    { title: "DATE", dataIndex: "createdAt" },
    {
      title: "CUSTOMERS",
      render: (record) => (
        <Space>
          <div>
            <strong>{record.customer_name}</strong>
            <br />
            <small>{record.customer_email}</small>
          </div>
        </Space>
      ),
    },
    {
      title: "PAYMENT",
      dataIndex: "payment_status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "STATUS",
      dataIndex: "order_status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
  ];

  const handleExport = ({ key }) => {
    if (key === "1") window.print();
  };

  const OrderDetailsDrawer = ({ visible, onClose, order }) => (
    <Drawer title="Order Details" width={720} onClose={onClose} open={visible}>
      {order ? (
        <div>
          <Steps
            current={ORDER_STATUS_STEP[order.order_status] ?? 0}
            size="small"
            progressDot
            style={{ marginBottom: 20 }}
          >
            <Steps.Step
              title="Order Placed"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Order Processed"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Packed"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Dispatched"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Out for Delivery"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Delivered"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Cancelled"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
          </Steps>
          <Steps
            current={ORDER_STATUS_PAYMENT[order.payment_status] ?? 0}
            size="small"
            progressDot
            style={{ marginBottom: 20 }}
          >
            <Steps.Step
              title="Pending"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.payment_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Paid"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.payment_status),
                  }}
                />
              }
            />
            <Steps.Step
              title="Returned"
              icon={
                <div
                  style={{
                    backgroundColor: getStatusColor(order.order_status),
                  }}
                />
              }
            />
          </Steps>
          <h4>Customer Info :</h4>
          <h6>
            <li>Name: {order.customer_name}</li>
            <li>
              Phone Number: {order.shipping_address?.mobilenumber || "N/A"}
            </li>
            <li>Email: {order.customer_email}</li>
          </h6>
          <h4>Shipping Address :</h4>
          <div>
            <h6>
              {order.shipping_address?.addressLine1},{" "}
              {order.shipping_address?.landmark},{order.shipping_address?.area},{" "}
              {order.shipping_address?.city},{order.shipping_address?.state},{" "}
              {order.shipping_address?.country} -
              {order.shipping_address?.pincode}
            </h6>
          </div>
          <div>
            <h4>Product Details :</h4>
            {order.orderItems?.map((item, index) => (
              <span key={item.id + index}>
                <h6>Product Name: {item.productName}</h6>
                <h6>Product Quantity: {item.qty}</h6>
                <h6>Product Price: ₹{item.price}</h6>
                <h6>
                  {item.qty} X ₹{item.price} = ₹
                  {(item.qty * item.price).toFixed(2)}
                </h6>
              </span>
            ))}
          </div>
          <h4>Subtotal :</h4>
          <h6>₹{parseFloat(order.subtotal).toFixed(2)}</h6>
          <h4>Tax :</h4>
          <h6>+ ₹{parseFloat(order.tax).toFixed(2)}</h6>
          <h4>Total :</h4>
          <h6>₹{parseFloat(order.total).toFixed(2)}</h6>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Drawer>
  );
  return (
    <>
      <Header />
      <div style={{ display: "flex", height: "100%" }}>
        <Sidebar />
        <div style={{ padding: "20px", width: "100%" }}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="productlist_box"
                style={{ display: "flex" }}
              >
                <div>
                  <h4 style={{ margin: "0 0 8px 0" }}>{item.orders}</h4>
                  <span
                    style={{
                      display: "block",
                      color: "#777",
                      marginBottom: "5px",
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                <div className="productlist_box_icon">{item.icon}</div>
              </div>
            ))}
          </div>

          <div className="productlist_box" style={{ marginTop: "20px" }}>
            <Space
              style={{
                marginBottom: 16,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Input
                placeholder="Search Order"
                prefix={<SearchOutlined />}
                onChange={handleSearch}
                style={{ width: 200 }}
              />
              <div>
                <Select
                  defaultValue={pageSize}
                  style={{ width: 80, marginRight: "20px" }}
                  onChange={(v) => {
                    setPageSize(v);
                    setCurrentPage(1);
                  }}
                >
                  {[5, 10, 20, 50, 100].map((size) => (
                    <Select.Option key={size} value={size}>
                      {size}
                    </Select.Option>
                  ))}
                </Select>

                <Dropdown
                  menu={{ items: exportItems, onClick: handleExport }}
                  trigger={["click"]}
                >
                  <Button icon={<UploadOutlined />}>
                    Export <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </Space>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
              pagination={false}
            />

            {!loading && filteredData.length === 0 && (
              <div style={{ marginTop: "20px" }}>No orders found</div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <span style={{ color: "#a1a1aa", fontSize: "14px" }}>
                {filteredData.length === 0
                  ? "Showing 0 of 0 results"
                  : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                      currentPage * pageSize,
                      filteredData.length
                    )} of ${filteredData.length} results`}
              </span>

              <Pagination
                current={currentPage}
                total={filteredData.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>

      <OrderDetailsDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        order={selectedOrder}
      />
      <Footer />
    </>
  );
};

export default Orderlist;
