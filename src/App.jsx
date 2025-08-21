import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Header from "./components/HeaderComponent";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Header />
      <div style={{ display: "flex", width: "auto", Height: "100%" }}>
        <Sidebar />
        <Dashboard />
      </div>
      <Footer />
    </>
  );
}

export default App;
