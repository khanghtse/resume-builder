import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Login from "./Login";

/**
 * A layout component that renders a navbar and an outlet.
 * The navbar is always visible, and the outlet is rendered below the navbar.
 * The component is wrapped in a div with a minimum height of the screen and a gray background.
 * This component is used as a wrapper for all pages in the application.
 */
const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;
