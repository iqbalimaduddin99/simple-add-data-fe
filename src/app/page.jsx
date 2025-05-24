'use client';
import React from "react";
import Header from "../components/header";
import Banner from "../components/banner";
import AdsHome from "../components/adsHome";
import SectionHome from "../components/sectionHome";
import Footer from "../components/footer";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Banner />
        <AdsHome />
        <SectionHome />
      </main>
      <Footer />
    </div>
  );
}

