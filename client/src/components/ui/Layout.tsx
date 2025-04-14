import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={"text-secondary background flex min-h-screen flex-col text-base antialiased"}>
      <Header />
      <main className="container grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
