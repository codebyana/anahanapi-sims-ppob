// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { BalanceProvider } from "./context/BalanceContext";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import TopUp from "./components/Transactions/TopUp";
import Transaction from "./components/Transactions/Transaction";
import Account from "./components/Profile/Account";
import Listrik from "./components/Transactions/Listrik"; // Import Listrik component

function App() {
  return (
    <BalanceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/account" element={<Account />} />
          <Route path="/services/PLN" element={<Listrik />} />
        </Routes>
      </Router>
    </BalanceProvider>
  );
}

export default App;
