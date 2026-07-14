import "./globals.css";

export const metadata = {
  title: "COCKPIT | Arpetal Reisen",
  description: "Digitale Leitstelle von Arpetal Reisen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
