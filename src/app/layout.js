import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TIMES TABLU",
  description: "hrms system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TIMES TABLU</title>
        <link
          rel="shortcut icon"
          type="image/png"
          href="/assets/images/logos/favicon.png"
        />
        <link rel="stylesheet" href="/assets/css/styles.min.css" />
        
      </head>
      <body className={inter.className}  suppressHydrationWarning={false}>
        {children}
        <ToastContainer position="bottom-left" autoClose={1500}/>
        <script src="/assets/libs/jquery/dist/jquery.min.js"></script>
        <script src="/assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/assets/js/sidebarmenu.js"></script>
        <script src="/assets/js/app.min.js"></script>
        <script src="/assets/libs/apexcharts/dist/apexcharts.min.js"></script> 
        {/* <script src="../assets/libs/simplebar/dist/simplebar.js"></script>
        <script src="./node_modules/preline/dist/preline.js"></script>
        <script src="../assets/js/dashboard.js"></script> */}
      </body>
    </html>
  );
}
