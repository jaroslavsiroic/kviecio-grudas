import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";

const NotFound = async () => {
  return (
    <>
      <SeoMeta title={"Puslapis nerastas"} />
      <section className="section-sm text-center">
        <div className="container">
          <div className="row justify-center">
            <div className="sm:col-10 md:col-8 lg:col-6">
              <span className="text-[8rem] block font-bold text-dark dark:text-darkmode-dark">
                404
              </span>
              <h1 className="h2 mb-4">Puslapis nerastas</h1>
              <div className="content">
                <p>
                  Puslapis, kurio ieškote, gali būti pašalintas, buvo pakeistas
                  jo pavadinimas arba jis laikinai nepasiekiamas.
                </p>
              </div>
              <Link href="/" className="btn btn-primary mt-8">
                Grįžti į pagrindinį puslapį
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
