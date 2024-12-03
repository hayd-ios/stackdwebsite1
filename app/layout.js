import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Stackd. - Bulk Image Sharing",
  description:
    "Stackd. is a bulk image sharing app that allows you to share multiple images at once with your friends and family. Save photos to your camera roll with a single swipe. Share, Swipe, Save.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
