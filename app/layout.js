import Navbar from './components/Navbar';
import './globals.css';
import '../public/styles/globals.css';

export const metadata = {
  title: "ITD - Registration",
  description: "This is the registration page for the ITD Event",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
