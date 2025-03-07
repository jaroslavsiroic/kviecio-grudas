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
