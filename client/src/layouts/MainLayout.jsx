// C:\secure-online-voting-system\client\src\layouts\MainLayout.jsx
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const authRoutes = ["/", "/login", "/register"];

const MainLayout = () => {
  const { pathname } = useLocation();
  const isAuthPage = authRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ScrollRestoration getKey={(location) => location.pathname} />
      {!isAuthPage && <Navbar />}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;