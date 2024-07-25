import React, { ReactNode } from "react";

const Layout = ({
  navColor,
  navLink,
  children,
}: {
  navColor: string;
  navLink: string;
  children: ReactNode;
}) => {
  return (
    <>
      <nav style={navStyle(navColor)}>
        <div className="container align-center">
          <img
            height="200px"
            width="1000px"
            style={{ maxWidth: "100%", margin: "1rem" }}
            src="https://raw.githubusercontent.com/sejori/peko/main/example/preactSSR/assets/logo_dark_alpha.webp"
            alt="peko-logo"
          />
          <h1 style={{ textAlign: "center" }}>
            Featherweight{" "}
            <a href={navLink} style={navLinkStyle}>
              apps
            </a>
          </h1>
          <h2 style={{ textAlign: "center" }}>on the edge 🐣⚡</h2>
        </div>
      </nav>

      <main style={{ padding: "1rem" }} className="container">
        {children}
      </main>

      <footer style={footerStyle}>
        <div className="container row">
          <a style={footerLinkStyle} href="https://github.com/sebringrose/peko">
            <img
              src="https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/github.svg"
              width="100"
              height="100"
              alt="GitHub"
            />
            Source repo
          </a>
          <a
            className="align-center"
            style={footerLinkStyle}
            href="https://doc.deno.land/https://deno.land/x/peko/mod.ts"
          >
            <img
              src="https://raw.githubusercontent.com/denolib/high-res-deno-logo/master/deno_hr_circle.svg"
              width="100"
              height="100"
              alt="Deno"
            />
            API docs
          </a>
        </div>
        <div className="container row">
          <a style={footerLinkStyle} href="/">
            Home
          </a>
          <a style={footerLinkStyle} href="/about">
            About
          </a>
        </div>
        <p style={{ margin: "10px", textAlign: "center" }}>
          Made by <a href="https://thesebsite.com">Sejori</a>
        </p>
      </footer>
    </>
  );
};

const navStyle = (navColor: string) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  color: "white",
  backgroundColor: navColor,
  paddingBottom: "20px",
});

const navLinkStyle = {
  color: "white",
};

const footerStyle = {
  paddingTop: "20px",
};

const footerLinkStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  fontSize: "1rem",
  padding: "0px 5px",
  marginBottom: "1rem",
};

export default Layout;
