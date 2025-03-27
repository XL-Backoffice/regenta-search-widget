import React, { lazy, useEffect } from "react";
const Search = lazy(() => import("./search"));
export default function Home() {
  useEffect(() => {
    console.log("Home");
  }, [])
  return (
    <>
      <main>
        <section className="w-full relative">
          <div className="seatchbar_sticky">
            <Search page="home" />
          </div>
        </section>
      </main>
    </>
  );
}
