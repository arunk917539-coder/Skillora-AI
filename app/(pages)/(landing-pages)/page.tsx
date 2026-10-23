
import MainBanner from "@/app/components/banners/main-banner";
import React from "react";
import ShowCaseBanner1 from "../../components/banners/showcase-banner-1";
import ShowcaseBanner2 from "../../components/banners/showcase-banner-2";
import ShowcaseBanner3 from "../../components/banners/showcase-banner-3";
import SubBanner from "../../components/banners/sub-banner";


export default async function Home() {
  return (
    <main className="px-6 sm:px-6 md:px-8 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1280px] mx-auto" >
      <MainBanner />
      <SubBanner />
      <ShowCaseBanner1 />
      <ShowcaseBanner2 />
      <ShowcaseBanner3 />
    </main >
  );
}
