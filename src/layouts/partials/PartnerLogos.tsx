import { getFileURL } from "@/lib/pocketbase";
import { Partner } from "@/types";

export default function PartnerLogos({ partners }: { partners: Partner[] }) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mx-auto mb-12 text-center md:col-10 lg:col-8 xl:col-6">
        <h2 className="mb-4">Partneriai</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {partners.map((partner, index) => (
          <a href={partner.website} key={index}>
            <img
              src={getFileURL(partner, partner.logo)}
              alt={partner.name}
              className="w-100 h-24 object-contain mx-auto"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
