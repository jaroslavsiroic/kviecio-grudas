"use client";

/* eslint-disable react/no-unescaped-entities */
import CollectionsSlider from "@/components/CollectionsSlider";
import HeroSlider, { HeroPost } from "@/components/HeroSlider";
import SkeletonCategory from "@/components/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import {
  getFileURL,
  homepageQuery,
  usePartners,
  usePromos,
  useTestimonials,
} from "@/lib/pocketbase";
import CallToAction from "@/partials/CallToAction";
import SeoMeta from "@/partials/SeoMeta";
import Testimonials from "@/partials/Testimonials";
import { Suspense } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import fieldImg from "../../public/images/field.png";
import fieldNoBgImg from "../../public/images/field_no_bg.png";
import PartnerLogos from "@/partials/PartnerLogos";
import { Promo } from "@/types";
import ImageFallback from "@/helpers/ImageFallback";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import Link from "next/link";
import { isLoggedIn } from "@/lib/pocketbase";

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
  const { data: promos } = usePromos();
  const { data: loggedIn } = isLoggedIn();

  // const { data: homepage, isLoading: homepageLoading } = homepageQuery();

  return (
    <>
      <SeoMeta />
      {loggedIn && (
        <section className="section">
          <div className="container">
            <div className="bg-body dark:bg-darkmode-body shadow-lg rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-border dark:border-darkmode-border">
              {/* Left Side: Rectangular Date */}
              <div className="flex flex-col items-center justify-center bg-transparent border-2 border-dark/10 dark:border-darkmode-dark/20 text-dark dark:text-darkmode-dark rounded-xl p-4 w-32 h-32 flex-shrink-0 shadow-sm transform hover:scale-105 transition-transform duration-300">
                <span className="text-sm font-medium uppercase tracking-widest opacity-80">
                  {format(new Date(), "MMM", { locale: lt })}
                </span>
                <span className="text-6xl font-bold leading-none my-1">
                  {format(new Date(), "d")}
                </span>
                <span className="text-sm font-medium opacity-80">
                  {format(new Date(), "yyyy")}
                </span>
              </div>

              {/* Right Side: Text & CTA */}
              <div className="text-center md:text-left flex-1">
                <h2 className="h2 mb-4 text-dark dark:text-darkmode-dark">
                  Dienos grūdas
                </h2>
                <p className="mb-6 text-lg text-text dark:text-darkmode-text">
                  Kviečiame skaityti šios dienos Evangeliją ir pagalbinius
                  klausimus asmeninei maldai
                </p>
                <Link
                  href="/dienos_grudas"
                  className="btn btn-primary font-medium px-8 py-3 text-lg hover:shadow-lg transition-shadow duration-300"
                >
                  Skaityti dienos Grūdą
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
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
      {promos && (
        <section>
          <div className="container">
            {promos?.map((promo: Promo, index: number) => (
              <div
                className={`lg:flex gap-8 mt-14 lg:mt-28`}
                key={promo?.title}
              >
                {index % 2 === 0 ? (
                  <>
                    <ImageFallback
                      className="rounded-md mx-auto"
                      src={getFileURL(promo, promo.image)}
                      width={536}
                      height={449}
                      alt={promo?.title}
                    />
                    <div className="mt-10 lg:mt-0">
                      <h2>{promo?.title}</h2>
                      <p
                        className="mt-4 text-light leading-7"
                        dangerouslySetInnerHTML={{ __html: promo?.description }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h2>{promo.title}</h2>
                      <p
                        className="mt-4 text-light leading-7"
                        dangerouslySetInnerHTML={{ __html: promo?.description }}
                      />
                    </div>
                    <ImageFallback
                      className="rounded-md mx-auto mt-10 lg:mt-0"
                      src={getFileURL(promo, promo.image)}
                      width={536}
                      height={449}
                      alt={promo.title}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
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
