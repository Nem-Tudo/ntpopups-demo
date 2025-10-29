import Providers from "../../contexts/Providers";
import "./globals.css";
import "./page.css";

export const metadata = {
  title: "ntPopups Demo",
  description: "See ntPopups features!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}