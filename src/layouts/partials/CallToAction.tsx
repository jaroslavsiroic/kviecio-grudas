import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { Call_to_action } from "@/types";
import Image from "next/image";
import Link from "next/link";

const CallToAction = ({ data }: { data: Call_to_action }) => {
  return (
    <>
      {data.enable && (
        <section className="section">
          <div className="container">
            <div className="rounded-xl bg-theme-light dark:bg-darkmode-theme-light">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="px-6 py-8 md:py-16 lg:mb-10 mb-0 lg:col-6 xl:col-6 mx-auto text-center order-2 lg:order-0">
                  <p
                    dangerouslySetInnerHTML={markdownify(data.sub_title)}
                    className="md:text-lg text-dark dark:text-darkmode-dark font-bold"
                  />
                  <h2
                    dangerouslySetInnerHTML={markdownify(data.title)}
                    className="my-2 md:h1 sm:h2 h3"
                  />

                  <p
                    dangerouslySetInnerHTML={
                      data?.description
                        ? markdownify(data?.description)
                        : { __html: "" }
                    }
                    className="mb-6 md:text-lg"
                  />

                  {data.button.enable && (
                    <Link
                      className="btn btn-md md:btn-lg btn-primary font-medium"
                      href={data.button.link}
                    >
                      {data.button.label}
                    </Link>
                  )}
                </div>

                <div className="mx-auto lg:col-5 mb-6 lg:mb-0">
                  <Image
                    src={data.image}
                    width={543}
                    height={390}
                    alt="image"
                    className="mx-auto h-full lg:w-full hidden lg:block"
                    priority
                  />
                  <Image
                    src={data?.imageSmall}
                    width={543}
                    height={390}
                    alt="image"
                    className="rounded-xl mx-auto w-auto block lg:hidden"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CallToAction;
