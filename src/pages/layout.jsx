import PluginInit from "@/helper/PluginInit";
import "./font.css";
import "./globals.css";

export const metadata = {
  title: "UNI | Univerz",
  description: "Univerz ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <PluginInit />
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
