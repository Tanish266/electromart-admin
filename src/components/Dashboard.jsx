import React from "react";
import { Card, Row, Col, Progress, Button } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const visitorData = [
  { day: "M", visitors: 20 },
  { day: "T", visitors: 50 },
  { day: "W", visitors: 30 },
  { day: "T", visitors: 70 },
  { day: "F", visitors: 60 },
  { day: "S", visitors: 90 },
  { day: "S", visitors: 50 },
];

const profitData = [
  { month: "Jan", profit: 200 },
  { month: "Apr", profit: 300 },
  { month: "Jul", profit: 250 },
  { month: "Oct", profit: 400 },
];
const cardStyle = {
  height: "300px", // You can adjust height as per your UI
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const DashboardContent = () => {
  return (
    <div style={{ padding: "20px", width: "100%" }}>
      {/* Welcome Card */}
      <Card
        style={{ marginBottom: "20px" }}
        extra={
          <TrophyOutlined style={{ fontSize: "40px", color: "#faad14" }} />
        }
      >
        <h3>Congratulations Katie! 🎉</h3>
        <p>Best seller of the month</p>
        <h2>$48.9k</h2>
        <p>78% of target 🚀</p>
        <Button type="primary">View Sales</Button>
      </Card>

      {/* Visitors & Activity */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="New Visitors">
            <h2>
              23% <ArrowDownOutlined style={{ color: "red" }} /> -13.24%
            </h2>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={visitorData}>
                <XAxis dataKey="day" />
                <Bar dataKey="visitors" fill="#595959" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Activity">
            <h2>
              82% <ArrowUpOutlined style={{ color: "green" }} /> +24.8%
            </h2>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={visitorData}>
                <XAxis dataKey="day" />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#52c41a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Sales, Profit, Expenses, Transactions */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col xs={24} md={6}>
          <Card title="Sales" style={cardStyle}>
            <div>
              <h2>$4,679</h2>
              <div style={{ color: "green" }}>
                <ArrowUpOutlined /> +28.42%
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title="Profit" style={cardStyle}>
            <div>
              <h2>624k</h2>
              <ResponsiveContainer width="100%" height={60}>
                <BarChart data={profitData}>
                  <XAxis dataKey="month" />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#52c41a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title="Expenses" style={cardStyle}>
            <div>
              <Progress
                type="dashboard"
                percent={78}
                strokeColor="#000"
                style={{ marginBottom: "10px" }}
              />
              <p>$21k Expenses more than last month</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title="Transactions" style={cardStyle}>
            <div>
              <h2>$14,857</h2>
              <div style={{ color: "green" }}>
                <ArrowUpOutlined /> +28.14%
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
