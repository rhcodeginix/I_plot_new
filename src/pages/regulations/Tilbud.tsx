import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Button from "@/components/common/button";
import Link from "next/link";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import GoogleMapComponent from "@/components/Ui/map";
// import LeadsBox from "@/components/Ui/husmodellPlot/leadsBox";
import { useRouter } from "next/router";
import NorkartMap from "@/components/map";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "react-hot-toast";
import { addDaysToDate } from "@/components/Ui/husmodellPlot/Tilbudsdetaljer";

const Tilbud: React.FC<{
  handleNext: any;
  lamdaDataFromApi: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
  askData: any;
  HouseModelData: any;
  handlePrevious: any;
  supplierData: any;
  user: any;
}> = ({
  handleNext,
  lamdaDataFromApi,
  askData,
  loadingLamdaData,
  CadastreDataFromApi,
  HouseModelData,
  handlePrevious,
  supplierData,
  user,
}) => {
  const router = useRouter();
  const { query: queryy } = router;
  const updatedQuery = { ...queryy };
  const { husmodellId, homePage } = router.query;
  const plotId = router.query["plotId"];

  const Huskonfigurator =
    HouseModelData?.Huskonfigurator?.hovedkategorinavn || [];
  const Husdetaljer = HouseModelData?.Husdetaljer;

  const totalDays = [
    Husdetaljer?.signConractConstructionDrawing +
      Husdetaljer?.neighborNotification +
      Husdetaljer?.appSubmitApprove +
      Husdetaljer?.constuctionDayStart +
      Husdetaljer?.foundationWork +
      Husdetaljer?.concreteWork +
      Husdetaljer?.deliveryconstuctionKit +
      Husdetaljer?.denseConstuction +
      Husdetaljer?.completeInside +
      Husdetaljer?.preliminaryInspection +
      Husdetaljer?.takeOver,
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const [custHouse, setCusHouse] = useState<any>(null);
  useEffect(() => {
    const customizeHouse = localStorage.getItem("customizeHouse");
    if (customizeHouse) {
      setCusHouse(JSON.parse(customizeHouse));
    }
  }, []);

  const totalCustPris = custHouse
    ? custHouse?.reduce(
        (sum: any, item: any) =>
          sum + Number(item?.product?.pris.replace(/\s/g, "")),
        0
      )
    : 0;

  const [updatedArray, setUpdatedArray] = useState([]);

  useEffect(() => {
    if (Huskonfigurator?.length > 0 && custHouse?.length > 0) {
      const mergedArray = Huskonfigurator.map(
        (category: any, catIndex: number) => {
          const matchedSubCategories = category.Kategorinavn.map(
            (subCategory: any, subIndex: number) => {
              const match = custHouse.find(
                (item: any) =>
                  item.category === catIndex && item.subCategory === subIndex
              );

              if (match) {
                return {
                  ...subCategory,
                  produkter: [match.product],
                };
              }

              return null;
            }
          ).filter(Boolean);

          if (matchedSubCategories.length > 0) {
            return {
              ...category,
              Kategorinavn: matchedSubCategories,
            };
          }

          return null;
        }
      ).filter(Boolean);

      setUpdatedArray(mergedArray);
    }
  }, [Huskonfigurator, custHouse]);
  const leadId = router.query["leadId"];

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !plotId || !husmodellId) return;

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty");
      queryParams.delete("leadId");

      try {
        const plotDocSnap = await getDoc(doc(db, "empty_plot", String(plotId)));
        const husmodellDocSnap = await getDoc(
          doc(db, "house_model", String(husmodellId))
        );

        const finalData = {
          plot: { id: plotId, ...plotDocSnap.data() },
          husmodell: { id: husmodellId, ...husmodellDocSnap.data() },
        };

        const leadsQuerySnapshot: any = await getDocs(
          query(
            collection(db, "leads"),
            where("finalData.husmodell.id", "==", husmodellId),
            where("finalData.plot.id", "==", String(plotId)),
            where("user.id", "==", user.id)
          )
        );

        let leadIdToSet: any = "";

        if (!leadsQuerySnapshot.empty) {
          leadIdToSet = leadsQuerySnapshot.docs[0].id;
          const data = leadsQuerySnapshot.docs[0].data();
          if (data.Isopt === true || data.IsoptForBank === true) {
            const timestamp = leadsQuerySnapshot.docs[0].data().updatedAt;

            const finalDate = new Date(
              timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000
            );
            setDate(finalDate);
          }
        } else {
          const docRef = await addDoc(collection(db, "leads"), {
            finalData,
            user,
            Isopt: false,
            IsoptForBank: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            IsEmptyPlot: isEmptyPlot === "true",
          });
          leadIdToSet = docRef.id;
        }

        queryParams.set("leadId", leadIdToSet);
        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    if (husmodellId && user && plotId) {
      fetchData();
    }
  }, [plotId, husmodellId, user]);

  const totalByggestartDays = [
    Husdetaljer?.signConractConstructionDrawing +
      Husdetaljer?.neighborNotification +
      Husdetaljer?.appSubmitApprove +
      Husdetaljer?.constuctionDayStart,
  ].reduce((acc, curr) => acc + (curr || 0), 0);

  const ByggestartDate = addDaysToDate(date, totalByggestartDays);

  return (
    <div className="relative">
      <div className="bg-lightBlue py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-primary text-xs md:text-sm font-bold"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-primary text-xs md:text-sm font-bold cursor-pointer"
              onClick={() => {
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Tomt
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            {!homePage && (
              <>
                <div
                  className="text-primary text-xs md:text-sm font-bold cursor-pointer"
                  onClick={() => {
                    delete updatedQuery.propertyId;
                    delete updatedQuery.husmodellId;
                    delete updatedQuery.leadId;
                    delete updatedQuery.emptyPlot;

                    router.push(
                      {
                        pathname: router.pathname,
                        query: updatedQuery,
                      },
                      undefined,
                      { shallow: true }
                    );
                    const currIndex = 1;
                    localStorage.setItem("currIndex", currIndex.toString());
                    handlePrevious();
                  }}
                >
                  Hva kan du bygge?
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              </>
            )}
            <div
              className="text-primary text-xs md:text-sm font-bold cursor-pointer"
              onClick={() => {
                const currIndex = 3;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Tilpass
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">Tilbud</span>
          </div>
          <PropertyHouseDetails
            HouseModelData={HouseModelData}
            lamdaDataFromApi={lamdaDataFromApi}
            loading={loadingLamdaData}
            CadastreDataFromApi={CadastreDataFromApi}
            supplierData={supplierData}
          />
        </SideSpaceContainer>
      </div>
      <div className="hidden lg:block">
        <PropertyDetails
          askData={askData}
          CadastreDataFromApi={CadastreDataFromApi}
          lamdaDataFromApi={lamdaDataFromApi}
          HouseModelData={HouseModelData}
        />
      </div>

      <div className="pt-6 pb-8">
        <SideSpaceContainer>
          <h5 className="text-darkBlack text-base md:text-lg desktop:text-xl font-semibold mb-2 md:mb-4">
            Tilbud
          </h5>
          <div className="flex flex-col desktop:flex-row items-start gap-6">
            <div className="w-full desktop:w-[40%]">
              <div className="border border-[#DCDFEA] rounded-lg p-3 md:p-5">
                <h4 className="text-black text-sm md:text-base lg:text-lg mb-1">
                  <span className="font-semibold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  bygget i{" "}
                  {
                    CadastreDataFromApi?.presentationAddressApi?.response?.item
                      ?.formatted?.line1
                  }{" "}
                  <span className="text-secondary2">
                    (
                    {
                      CadastreDataFromApi?.presentationAddressApi?.response
                        ?.item?.street?.municipality?.municipalityName
                    }
                    )
                  </span>
                </h4>
                <p className="text-secondary2 text-xs md:text-sm">
                  {
                    CadastreDataFromApi?.presentationAddressApi?.response?.item
                      ?.formatted?.line2
                  }
                </p>
                <div className="flex gap-2 h-[150px] sm:h-[189px] mb-2 md:mb-4">
                  <div className="w-[63%] h-full relative">
                    <img
                      src={Husdetaljer?.photo}
                      alt="husmodell"
                      className="w-full h-full rounded-[8px] object-cover"
                    />
                    <img
                      src={supplierData?.photo}
                      alt="product-logo"
                      className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[107px]"
                    />
                  </div>
                  <div className="w-[37%] rounded-[8px] overflow-hidden h-full">
                    {/* <GoogleMapComponent
                      coordinates={
                        lamdaDataFromApi?.coordinates?.convertedCoordinates
                      }
                    /> */}
                    {lamdaDataFromApi?.coordinates?.convertedCoordinates && (
                      <NorkartMap
                        coordinates={
                          lamdaDataFromApi?.coordinates?.convertedCoordinates
                        }
                        MAX_ZOOM={20}
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="text-darkBlack text-xs md:text-sm font-semibold">
                    {Husdetaljer?.BebygdAreal}{" "}
                    <span className="text-[#4A5578] font-normal">m²</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-darkBlack text-xs md:text-sm font-semibold">
                    {Husdetaljer?.Soverom}{" "}
                    <span className="text-[#4A5578] font-normal">soverom</span>
                  </div>
                  <div className="border-l border-[#EAECF0] h-[12px]"></div>
                  <div className="text-darkBlack text-xs md:text-sm font-semibold">
                    {Husdetaljer?.Bad}{" "}
                    <span className="text-[#4A5578] font-normal">bad</span>
                  </div>
                  {askData?.bya_calculations?.input?.plot_size && (
                    <div className="text-darkBlack text-xs md:text-sm font-semibold ml-auto">
                      {askData?.bya_calculations?.input?.plot_size}{" "}
                      <span className="text-[#4A5578] font-normal">m²</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-[#EAECF0] w-full my-2 md:my-3 desktop:my-4"></div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <p className="text-[#4A5578] text-xs md:text-sm mb-1 truncate">
                    Pris for{" "}
                    <span className="font-semibold">
                      {Husdetaljer?.husmodell_name}
                    </span>
                  </p>
                  <h6 className="text-xs md:text-base font-semibold desktop:text-lg">
                    {formatCurrency(
                      (isNaN(totalCustPris) ? 0 : totalCustPris) +
                        (Husdetaljer?.pris
                          ? Number(Husdetaljer.pris.replace(/\s/g, ""))
                          : 0)
                    )}
                  </h6>
                </div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex flex-col gap-1 w-max">
                    <p className="text-secondary text-sm whitespace-nowrap">
                      Estimert byggestart
                    </p>
                    <h5 className="text-black text-sm font-semibold whitespace-nowrap">
                      {ByggestartDate}
                    </h5>
                  </div>
                  <div className="flex flex-col gap-1 w-max">
                    <p className="text-secondary text-xs md:text-sm whitespace-nowrap">
                      Estimert Innflytting
                    </p>
                    <h5 className="text-black text-sm font-semibold text-right whitespace-nowrap">
                      {addDaysToDate(date, totalDays)}
                    </h5>
                  </div>
                </div>
                <div className="bg-[#F4F3F1] rounded-lg p-3">
                  <p className="text-secondary2 text-xs md:text-sm mb-1 text-center">
                    Tilbudpris
                  </p>
                  <h4 className="text-center font-semibold text-lg md:text-lg desktop:text-2xl text-black mb-2">
                    {formatCurrency(
                      totalCustPris +
                        Number(Husdetaljer?.pris?.replace(/\s/g, ""))
                    )}
                  </h4>
                  <div className="text-secondary text-sm md:text-base text-center">
                    Tilbudet gjelder til{" "}
                    <span className="text-[#101828] font-semibold">
                      {/* 01.12.2025 */}
                      {new Date(
                        new Date().getFullYear(),
                        11,
                        31
                      ).toLocaleDateString("no-NO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {/* <LeadsBox col={true} /> */}
            </div>
            <div className="w-full desktop:w-[60%] border border-[#DCDFEA] rounded-lg overflow-hidden">
              <div className="p-3 md:p-5 border-b w-full border-[#DCDFEA] text-darkBlack text-base md:text-lg lg:text-xl font-semibold">
                Ditt tilbud på{" "}
                <span className="text-lg md:text-xl desktop:text-2xl">
                  {HouseModelData?.Husdetaljer?.husmodell_name}
                </span>{" "}
                inkluderer
              </div>
              <div className="p-3 md:p-5 flex flex-col md:flex-row gap-4 lg:gap-8">
                <div className="w-full md:w-[38%] bg-lightPurple2 rounded-lg h-max overflow-hidden">
                  <div className="p-3 md:p-4">
                    <h5 className="text-black font-semibold text-sm md:text-base mb-2 md:mb-[14px]">
                      Prisliste (inkludert MVA)
                    </h5>
                    <div className="flex flex-col gap-2 md:gap-3">
                      {/* {updatedArray?.length > 0 ? (
                        <div className="flex flex-col gap-2 md:gap-3">
                          {updatedArray.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="flex-col flex gap-2 md:gap-3"
                            >
                              {item?.Kategorinavn?.map(
                                (cat: any, catIndex: number) => (
                                  <div key={catIndex}>
                                    {cat?.produkter?.map(
                                      (product: any, proIndex: number) => (
                                        <div
                                          key={proIndex}
                                          className="flex gap-2 w-full justify-between"
                                        >
                                          <h4 className="text-secondary2 text-xs md:text-sm">
                                            {item?.navn}
                                          </h4>
                                          <div className="text-black font-medium text-xs md:text-sm">
                                            {product?.IncludingOffer
                                              ? "Standard"
                                              : formatCurrency(product?.pris)}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-3 text-lg">
                          Ingen tilpasning.
                        </p>
                      )}
                      <div className="w-full border-t border-[#DCDFEA]"></div> */}
                      <div className="flex gap-2 w-full justify-between">
                        <h4 className="text-secondary2 text-xs md:text-sm">
                          Totalt tilpassing
                        </h4>
                        <div className="text-black font-medium text-xs md:text-sm">
                          {totalCustPris ? formatCurrency(totalCustPris) : 0}
                        </div>
                      </div>
                      <div className="w-full border-t border-[#DCDFEA]"></div>
                      <div className="flex gap-2 w-full justify-between">
                        <h4 className="text-secondary2 text-xs md:text-sm">
                          Husmodellpris
                        </h4>
                        <div className="text-black font-medium text-xs md:text-sm">
                          {Husdetaljer ? formatCurrency(Husdetaljer?.pris) : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-lightPurple2 p-3 md:p-4 flex gap-2 w-full justify-between">
                    <h4 className="text-secondary2 text-xs md:text-sm">
                      Total
                    </h4>
                    <div className="text-black font-medium text-xs md:text-sm">
                      {formatCurrency(
                        totalCustPris +
                          Number(Husdetaljer?.pris?.replace(/\s/g, ""))
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[62%]">
                  {updatedArray?.length > 0 ? (
                    <div className="flex flex-col gap-4 md:gap-4 lg:gap-6">
                      {updatedArray.map((item: any, index: number) => (
                        <div key={index}>
                          <h4 className="text-black font-semibold text-sm md:text-base mb-2 md:mb-3">
                            {item?.navn}
                          </h4>
                          <div className="flex flex-col gap-2 md:gap-3">
                            {item?.Kategorinavn?.map(
                              (cat: any, catIndex: number) => (
                                <div key={catIndex}>
                                  {cat?.produkter?.map(
                                    (product: any, proIndex: number) => (
                                      <div
                                        key={proIndex}
                                        className="flex gap-2 md:gap-4 w-full"
                                      >
                                        <div className="w-[57px] h-[40px] rounded-[4px] overflow-hidden">
                                          <img
                                            src={product?.Hovedbilde?.[0]}
                                            alt="image"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="flex items-center justify-between gap-2 w-full">
                                          <div>
                                            <h5 className="text-black text-xs md:text-sm font-medium">
                                              {cat?.navn}
                                            </h5>
                                            <p className="text-secondary2 text-xs md:text-sm">
                                              {product?.Produktnavn}
                                            </p>
                                          </div>
                                          <div className="text-black font-semibold text-xs md:text-sm">
                                            {product?.IncludingOffer
                                              ? "Standard"
                                              : formatCurrency(product?.pris)}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-3 text-lg">
                      Du har ikke noe alternativ.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
      <div
        className="sticky bottom-0 bg-white py-4"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          zIndex: 9999,
        }}
      >
        <SideSpaceContainer>
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <p className="text-sm md:text-base font-light">
              En innsending er{" "}
              <span className="font-medium">uforpliktende</span> og du vil bli{" "}
              <br className="hidden md:block" />
              <span className="font-medium">
                kontaktet av en hyttekonsulent
              </span>
            </p>
            <div className="flex flex-row gap-4 sm:items-center">
              <Button
                text="Tilbake"
                className="border-2 border-primary text-primary hover:border-[#1E5F5C] hover:text-[#1E5F5C] focus:border-[#003A37] focus:text-[#003A37] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                onClick={() => {
                  handlePrevious();
                }}
              />
              <Button
                text="Send til Fjellheimhytta"
                className="border border-primary bg-primary hover:bg-[#1E5F5C] hover:border-[#1E5F5C] focus:bg-[#003A37] focus:border-[#003A37] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={async () => {
                  handleNext();
                  try {
                    if (leadId) {
                      await updateDoc(doc(db, "leads", String(leadId)), {
                        IsoptForBank: true,
                        updatedAt: new Date(),
                        Isopt: true,
                        EstimertByggestart: ByggestartDate,
                        EstimertInnflytting: addDaysToDate(date, totalDays),
                      });
                      toast.success("Lead sendt.", {
                        position: "top-right",
                      });
                    } else {
                      toast.error("Lead id not found.", {
                        position: "top-right",
                      });
                    }
                  } catch (error) {
                    console.error("Firestore update operation failed:", error);
                  }
                }}
              />
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default Tilbud;
