"use client";

import MDXContent from "@/helpers/MDXContent";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { isLoggedIn, useDailyMeditation } from "@/lib/pocketbase";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";
import { format, addDays, subDays, differenceInDays } from "date-fns";
import { lt } from "date-fns/locale";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { FaCircleChevronRight, FaCircleChevronLeft } from "react-icons/fa6";

// For all regular pages
const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    params.get("d") ? new Date(params.get("d") ?? "") : today,
  );
  const formatted = useMemo(() => {
    return {
      currentDateText: format(currentDate, "MMMM d", { locale: lt }),
      todayDateText: format(today, "MMMM d", { locale: lt }),
      currentDate: format(currentDate, "yyyy-MM-dd"),
    };
  }, [today, currentDate]);

  const { data, isLoading, error } = useDailyMeditation(formatted.currentDate);

  return (
    <>
      <PageHeader title={"Dienos grūdas"} />
      <div className="flex items-center justify-center align-middle gap-3">
        <span
          className="cursor-pointer"
          onClick={() => {
            if (Math.abs(differenceInDays(currentDate, today)) < 3) {
              setCurrentDate(subDays(currentDate, 1));
            }
          }}
        >
          <FaCircleChevronLeft
            opacity={
              Math.abs(differenceInDays(currentDate, today)) < 3 ? 1 : 0.35
            }
            size={35}
          />
        </span>
        <p className="h2">{formatted.currentDateText}</p>
        <span
          className="cursor-pointer"
          onClick={() => {
            if (formatted.currentDateText !== formatted.todayDateText) {
              setCurrentDate(addDays(currentDate, 1));
            }
          }}
        >
          <FaCircleChevronRight
            opacity={
              formatted.currentDateText !== formatted.todayDateText ? 1 : 0.35
            }
            size={35}
          />
        </span>
      </div>
      <section className="section">
        <div className="container">
          <div className="content">
            {isLoading && (
              <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
            )}
            {error && (
              <div className="text-center">
                <p className="h2">
                  Čia bus galima rasti dienos Evangeliją ir pagalbinius
                  klausimus asmeninei maldai.
                </p>
              </div>
            )}
            {data && (
              <>
                <div
                  className="ignore-css"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
