/* eslint-disable react/no-unescaped-entities */
import CollectionsSlider from "@/components/CollectionsSlider";
import HeroSlider, { HeroPost } from "@/components/HeroSlider";
import SkeletonCategory from "@/components/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import CallToAction from "@/partials/CallToAction";
import SeoMeta from "@/partials/SeoMeta";
import { Suspense } from "react";

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
  const callToAction = getListPage("sections/call-to-action.md");

  return (
    <>
      <SeoMeta />
      <section>
        <div className="container">
          <div className="bg-gradient py-10 rounded-md">
            <Suspense>
              <HeroSlider posts={products} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* category section  */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2>Collections</h2>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            {/* @ts-ignore */}
            {/* <ShowCollections /> */}
          </Suspense>
        </div>
      </section>

      {/* Featured Products section  */}
      <section>
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="mb-2">Featured Products</h2>
            <p className="md:h5">Explore Today's Featured Picks!</p>
          </div>
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            {/* <ShowFeaturedProducts /> */}
          </Suspense>
        </div>
      </section>

      <CallToAction data={callToAction} />
    </>
  );
};

export default Home;
