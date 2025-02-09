"use client";

import MDXContent from "@/helpers/MDXContent";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { isLoggedIn, useDailyMeditation } from "@/lib/pocketbase";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";
import { format } from "date-fns";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";

// For all regular pages
const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const date = params.get("d") ?? format(new Date(), "yyyy-MM-dd");
  const { data, isLoading, isError } = useDailyMeditation(date);

  return (
    <>
      <PageHeader title={"Dienos grūdas"} />
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
