import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oishii",
  description: "Oishii — Le carnet de recettes sans frontières",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        <header>
          <nav>
            <ul>
              <Link href="/">Home</Link>{" - "}
              <Link href="/login">Login</Link>{" - "}
              <Link href="/recette">Recette</Link>
            </ul>
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer></footer>
      </body>
    </html>
  );
}
