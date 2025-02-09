"use client";

import MDXContent from "@/helpers/MDXContent";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { donationQuery } from "@/lib/pocketbase";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";
import { format } from "date-fns";
import { notFound, useSearchParams } from "next/navigation";
import { BiLoaderAlt } from "react-icons/bi";

// For all regular pages
const Page = () => {
  const { data, isLoading } = donationQuery();
  return (
    <>
      <PageHeader title={"Prisidėk savo auka"} />
      <section className="section">
        <div className="container">
          <div className="content">
            {isLoading && (
              <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
            )}
            {data && (
              <div
                className="ignore-css"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
