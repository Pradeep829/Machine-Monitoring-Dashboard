import "./globals.css";

export const metadata = {
    title: "Machine Monitoring Dashboard",
    description: "Monitor your machines in real-time",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
