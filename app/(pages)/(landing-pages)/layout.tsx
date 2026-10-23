
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "../../globals.css";
import NavBar from "@/app/components/home/nav-bar";
import Provider from "@/app/provider";
import { ReactLenis } from "@/app/lib/lenis";
import Footer from "../../components/home/footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workplace Compass | Workplace Behaviour Assessment",
  description: "Practise realistic workplace scenarios, understand competency signals, and build a personal development plan.",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>

      <body className={`${spaceGrotesk.className} w-full`}>
        <ReactLenis root options={{ lerp: 0.8, duration: 1.5 }}>
          <Provider>
            <NavBar />
            {children}
            <Footer />
          </Provider>
        </ReactLenis>
      </body>
    </html>

  );
}
