import { Outlet } from "react-router-dom";

import Footer from "../common/Footer";
import Navbar from "../common/Navbar";


const UserLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
