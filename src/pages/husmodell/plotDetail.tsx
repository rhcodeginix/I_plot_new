import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_generelt from "@/public/images/Ic_generelt.svg";
import Ic_tak from "@/public/images/Ic_tak.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Img_product_detail_map from "@/public/images/Img_product_detail_map.png";
import Image from "next/image";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Ic_build_housing from "@/public/images/Ic_build_housing.svg";
import Ic_build_garage from "@/public/images/Ic_build_garage.svg";
import Ic_building_platting from "@/public/images/Ic_building_platting.svg";
import Ic_Superstructure from "@/public/images/Ic_Superstructure.svg";
import Button from "@/components/common/button";
import ContactForm from "@/components/Ui/stepperUi/contactForm";
import { useAddress } from "@/context/addressContext";
import { useRouter } from "next/router";

const PlotDetail: React.FC<any> = ({ handleNext }) => {
  const items = [
    {
      id: 1,
      imageSrc: Ic_build_housing,
      title: "Bygge bolig",
      price: "2.490.000 NOK",
    },
    {
      id: 2,
      imageSrc: Ic_build_garage,
      title: "Bygge garasje",
      price: "295.899 NOK",
    },
    {
      id: 1,
      imageSrc: Ic_Superstructure,
      title: "Påbygg",
      price: "490.000 NOK",
    },
    {
      id: 1,
      imageSrc: Ic_building_platting,
      title: "Bygge platting",
      price: "295.899 NOK",
    },
  ];

  const { getAddress } = useAddress();
  const router = useRouter();
  return (
    <div className="relative">
      <SideSpaceContainer className="relative">
        <div className="pt-[26px] pb-[46px] relative flex gap-[40px]">
          <div className="w-[66%]">
            <h2 className="text-black text-2xl font-semibold mb-6">
              Eiendomsinformajon
            </h2>
            <div className="w-full flex gap-8 mb-[60px]">
              <div className="w-2/6 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                <table className="table-auto border-0 w-full text-left property_detail_tbl">
                  <tbody>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Areal oppgitt
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Areal beregnet
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        869,7
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Arealkilde
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        Ikke oppgitt
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Etabelert dato
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        21.12.2012
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-2/6 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                <table className="table-auto border-0 w-full text-left property_detail_tbl">
                  <tbody>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Seksjonert
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        Nei
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Tinglyst
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        Ja
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Kulturminner registrert
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        Nei
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Aktive festegrunner
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        Nei
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Punktfeste
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        Nei
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-2/6 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
                <table className="table-auto border-0 w-full text-left property_detail_tbl">
                  <tbody>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Kommune
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        {getAddress?.kommunenavn} Kommune
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Kommunenr
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        {getAddress?.kommunenummer}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Gårdsnummer
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        {getAddress?.gardsnummer}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Bruksnummer
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        {getAddress?.bruksnummer}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Festenr
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        {getAddress?.festenummer}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Seksjonsnr
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left pb-[16px] text-secondary text-sm whitespace-nowrap">
                        Bruksnavn
                      </td>
                      <td className="text-left pb-[16px] text-black text-sm font-semibold whitespace-nowrap">
                        -
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-[34px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-black text-2xl font-semibold">
                  Reguleringsbestemmelser
                </h2>
                <Image src={Ic_generelt} alt="image" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>Innenfor 1/3 av fasadens lengde per takflate</span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    {" "}
                    Gesimshøyde for ark/kobbhus tilates inntil{" "}
                    <span className="text-black font-semibold">
                      8,0 meter,
                    </span>{" "}
                    og skal underordnes byggets mønehøyde.
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    Takterrasser tillates med inntil 6,5 meters høyde på
                    overkant gulv, og tillates ikke plassert nærmere nabogrense
                    enn 4,0 meter. For takterasser høyere enn 4,5 meter på
                    overkant gulv, gjelder følgende bestemmelser:
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>Innenfor 1/3 av fasadens lengde per takflate </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    {" "}
                    Gesimshøyde for ark/kobbhus tilates inntil{" "}
                    <span className="text-black font-semibold">
                      8,0 meter,
                    </span>{" "}
                    og skal underordnes byggets mønehøyde.
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    Takterrasser tillates med inntil 6,5 meters høyde på
                    overkant gulv, og tillates ikke plassert nærmere nabogrense
                    enn 4,0 meter. For takterasser høyere enn 4,5 meter på
                    overkant gulv, gjelder følgende bestemmelser:
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-black text-2xl font-semibold">
                  Reguleringsbestemmelser
                </h2>
                <Image src={Ic_tak} alt="image" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>Innenfor 1/3 av fasadens lengde per takflate</span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    {" "}
                    Gesimshøyde for ark/kobbhus tilates inntil{" "}
                    <span className="text-black font-semibold">
                      8,0 meter,
                    </span>{" "}
                    og skal underordnes byggets mønehøyde.
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    Takterrasser tillates med inntil 6,5 meters høyde på
                    overkant gulv, og tillates ikke plassert nærmere nabogrense
                    enn 4,0 meter. For takterasser høyere enn 4,5 meter på
                    overkant gulv, gjelder følgende bestemmelser:
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>Innenfor 1/3 av fasadens lengde per takflate </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    {" "}
                    Gesimshøyde for ark/kobbhus tilates inntil{" "}
                    <span className="text-black font-semibold">
                      8,0 meter,
                    </span>{" "}
                    og skal underordnes byggets mønehøyde.
                  </span>
                </div>
                <div className="flex items-center gap-3 text-secondary text-base">
                  <Image src={Ic_check_true} alt="image" />
                  <span>
                    Takterrasser tillates med inntil 6,5 meters høyde på
                    overkant gulv, og tillates ikke plassert nærmere nabogrense
                    enn 4,0 meter. For takterasser høyere enn 4,5 meter på
                    overkant gulv, gjelder følgende bestemmelser:
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[34%]">
            <h2 className="text-black text-2xl font-semibold mb-6">
              Eiendomsinformajon
            </h2>
            <Image
              src={Img_product_detail_map}
              alt="image"
              className="rounded-[12px] overflow-hidden w-full mb-[60px]"
            />
            <div>
              <div className="flex items-center gap-[36px] mb-6">
                <Image src={Ic_logo} alt="logo" />
                <p className="text-secondary text-sm">
                  Vi hjelper deg med{" "}
                  <span className="text-black font-semibold">
                    reguleringer, søknader
                  </span>{" "}
                  og{" "}
                  <span className="text-black font-semibold">
                    innheter tilbud.
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {items.map((item) => (
                  <div key={item.id}>
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      className="rounded-full overflow-hidden w-[80px] h-[80px] mb-3"
                    />
                    <h6 className="text-black font-medium text-base mb-2">
                      {item.title}
                    </h6>
                    <div className="gap-4 flex items-center justify-between mb-3">
                      <p className="text-secondary text-sm">Pris fra</p>
                      <h5 className="text-black text-base font-semibold">
                        {item.price}
                      </h5>
                    </div>
                    <Button
                      text="Utforsk boliger"
                      className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-full h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative"
                      path=""
                    />
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </SideSpaceContainer>
      <div
        className="sticky bottom-0 bg-white py-6"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
        }}
      >
        <SideSpaceContainer>
          <div className="flex justify-end gap-4 items-center">
            <Button
              text="Tilbake"
              className="border border-lightPurple bg-lightPurple text-blue sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
              onClick={() => {
                const { plot, ...restQuery } = router.query as any;
                const updatedQuery = new URLSearchParams(restQuery).toString();
                console.log(updatedQuery);

                router.push(
                  `${router.pathname}${updatedQuery ? `?${updatedQuery}` : ""}`
                );
              }}
            />
            <Button
              text="Se tilbud"
              className="border border-primary bg-primary text-white sm:text-base rounded-[8px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                handleNext();
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default PlotDetail;
