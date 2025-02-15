"use client";

/* eslint-disable react/no-unescaped-entities */
import CollectionsSlider from "@/components/CollectionsSlider";
import HeroSlider, { HeroPost } from "@/components/HeroSlider";
import SkeletonCategory from "@/components/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { homepageQuery, usePartners, useTestimonials } from "@/lib/pocketbase";
import CallToAction from "@/partials/CallToAction";
import SeoMeta from "@/partials/SeoMeta";
import Testimonials from "@/partials/Testimonials";
import { Suspense } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import fieldImg from "../../public/images/field.png";
import fieldNoBgImg from "../../public/images/field_no_bg.png";
import PartnerLogos from "@/partials/PartnerLogos";

// const ShowHeroSlider = async () => {
//   const sliderImages = await getCollectionProducts({
//     collection: collections.hero_slider,
//   });
//   const { products } = sliderImages;
//   return <HeroSlider products={} />;
// };

// const ShowCollections = async () => {
//   const collections = await getCollections();
//   return <CollectionsSlider collections={collections} />;
// };

// const ShowFeaturedProducts = async () => {
//   const { pageInfo, products } = await getCollectionProducts({
//     collection: collections.featured_products,
//     reverse: false,
//   });
//   return <FeaturedProducts products={products} />;
// };

const products: HeroPost[] = [
  {
    title: "Product 1",
    description: "Description for Product 1",
  },
  {
    title: "Product 2",
    description: "Description for Product 2",
  },
];

const Home = () => {
  const { data: testimonials, isLoading: testimonialsLoading } =
    useTestimonials();

  const { data: partners, isLoading: partnersLoading } = usePartners();

  // const { data: homepage, isLoading: homepageLoading } = homepageQuery();

  return (
    <>
      <SeoMeta />
      <CallToAction
        data={{
          enable: true,
          title: "Kviečio grūdo gavėnios programa moterims",
          sub_title: "Tikėti. Laisvėti. Dalintis. Būti.",
          // description: "description",
          button: {
            enable: true,
            label: `Skaityti aprašymą`,
            link: "/kviecio_grudas_aprasymas",
          },
          image: fieldNoBgImg,
          imageSmall: fieldImg,
        }}
      />
      {/* <section>
        <div className="container">
          <div className="bg-gradient py-10 rounded-md">
            <Suspense>
              <HeroSlider posts={products} />
            </Suspense>
          </div>
        </div>
      </section> */}

      {/* category section  */}
      {/* <section className="section">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2>Collections</h2>
          </div>
          <Suspense fallback={<SkeletonCategory />}> */}
      {/* @ts-ignore */}
      {/* <ShowCollections />
          </Suspense>
        </div>
      </section> */}

      {/* Featured Products section  */}
      {/* <section>
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="mb-2">Featured Products</h2>
            <p className="md:h5">Explore Today's Featured Picks!</p>
          </div>
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            {homepageLoading && (
              <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
            )}
            {homepage && (
              <div
                className="ignore-css"
                dangerouslySetInnerHTML={{ __html: homepage.content }}
              />
            )}
          </Suspense>
        </div>
      </section> */}
      {(testimonialsLoading || partnersLoading) && (
        <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
      )}
      {testimonials && (
        <Testimonials title={"Atsiliepimai"} testimonials={testimonials} />
      )}
      {partners && <PartnerLogos partners={partners} />}
    </>
  );
};

export default Home;
