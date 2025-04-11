import SideSpaceContainer from "@/components/common/sideSpace";
import BelopFilterSection from "./belopFilterSection";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import BelopProperty from "./belopProperty";
import { useRouter } from "next/router";
import Button from "@/components/common/button";
import Link from "next/link";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Image from "next/image";

const Belop: React.FC = () => {
  const router: any = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Hustype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForPlot: 0,
    maxRangeForPlot: 5000000,
    minRangeForHusmodell: 0,
    maxRangeForHusmodell: 5000000,
    Område: [] as string[],
    SubOmråde: [] as string[],
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const queryPrice = queryParams.get("pris");
    const maxRangePlot = queryParams.get("maxRangePlot");
    const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");
    setFormData((prev) => ({
      ...prev,
      maxRangeForPlot: maxRangePlot
        ? Number(maxRangePlot)
        : Number(queryPrice) * 0.4,
      maxRangeForHusmodell: maxRangeHusmodell
        ? Number(maxRangeHusmodell)
        : Number(queryPrice) * 0.6,
    }));
  }, []);

  // useEffect(() => {
  //   const fetchProperty = async () => {
  //     setIsLoading(true);
  //     try {
  //       const queryParams = new URLSearchParams(window.location.search);
  //       const soveromFormLocalStorage = JSON.parse(
  //         localStorage.getItem("soverom") || "[]"
  //       );
  //       setFormData((prev) => ({
  //         ...prev,
  //         AntallSoverom: soveromFormLocalStorage,
  //       }));
  //       const soveromValues = soveromFormLocalStorage.map((item: any) =>
  //         parseInt(item.replace(" Soverom", ""), 10)
  //       );
  //       const maxRangePlot: any = queryParams.get("maxRangePlot");
  //       const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");
  //       setFormData((prev) => ({
  //         ...prev,
  //         AntallSoverom: soveromFormLocalStorage,
  //       }));

  //       const db = getFirestore();
  //       const citiesCollectionRef = collection(db, "cities");
  //       const queryPrice = queryParams.get("pris");
  //       const cityQuery = queryParams.get("city");
  //       let cleanedCity = String(cityQuery).replace(/\s*\(\d+\)/, "");
  //       const cityFormLocalStorage = JSON.parse(
  //         localStorage.getItem("city") || "[]"
  //       );
  //       setFormData((prev) => ({
  //         ...prev,
  //         Område:
  //           cityFormLocalStorage.length > 0
  //             ? cityFormLocalStorage
  //             : [cleanedCity],
  //       }));
  //       const citiesSnapshot = await getDocs(citiesCollectionRef);
  //       const fetchedCities = citiesSnapshot.docs.map((doc) => ({
  //         propertyId: doc.id,
  //         ...doc.data(),
  //       }));
  //       const filterProperty: any = cityQuery
  //         ? fetchedCities.find(
  //             (property: any) => `${property.name}` === cleanedCity
  //           )
  //         : null;

  //       if (!filterProperty || !filterProperty.kommunenummer)
  //         return setHouseModelProperty([]);

  //       const kommuneNumbers = Object.values(filterProperty.kommunenummer)
  //         .map((value: any) =>
  //           parseInt(
  //             (typeof value === "string"
  //               ? value.replace(/"/g, "")
  //               : value
  //             ).toString(),
  //             10
  //           )
  //         )
  //         .filter((num) => !isNaN(num));

  //       if (kommuneNumbers.length === 0) return setHouseModelProperty([]);

  //       const [plotsRef, husmodellRef] = [
  //         collection(db, "empty_plot"),
  //         collection(db, "house_model"),
  //       ];
  //       const allHusmodell = (await getDocs(husmodellRef)).docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       const filteredHusmodell = queryPrice
  //         ? allHusmodell.filter(
  //             (plot: any) =>
  //               (maxRangeHusmodell
  //                 ? (plot?.Husdetaljer?.pris.replace(/\s/g, ""), 10) <=
  //                   parseInt(maxRangeHusmodell)
  //                 : parseInt(plot?.Husdetaljer?.pris.replace(/\s/g, ""), 10) <=
  //                   parseInt(queryPrice.replace(/\s/g, ""), 10) * 0.4) &&
  //               (soveromValues.length > 0
  //                 ? soveromValues.includes(plot?.Husdetaljer?.Soverom)
  //                 : true)
  //           )
  //         : allHusmodell;

  //       const allPlots: any = [];
  //       const chunkSize = 10;
  //       for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
  //         const chunk = kommuneNumbers.slice(i, i + chunkSize);
  //         const q = query(
  //           plotsRef,
  //           where(
  //             "lamdaDataFromApi.searchParameters.kommunenummer",
  //             "in",
  //             chunk
  //           )
  //         );
  //         const querySnapshot = await getDocs(q);
  //         querySnapshot.forEach((doc) => {
  //           const data = doc.data();
  //           if (data?.CadastreDataFromApi?.presentationAddressApi)
  //             allPlots.push({ id: doc.id, ...data });
  //         });
  //       }

  //       const filteredPlots = queryPrice
  //         ? allPlots.filter(
  //             (plot: any) =>
  //               plot.pris <=
  //               (maxRangePlot && parseInt(maxRangePlot, 10)
  //                 ? Number(maxRangePlot)
  //                 : parseInt(queryPrice, 10) * 0.6)
  //           )
  //         : allPlots;
  //       const combinedData = filteredPlots.flatMap((plot: any) =>
  //         filteredHusmodell.map((house) => ({ plot, house }))
  //       );

  //       setHouseModelProperty(combinedData);
  //     } catch (error) {
  //       console.error("Error fetching properties:", error);
  //       setHouseModelProperty([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProperty();
  // }, [db, router.asPath]);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);

        const db = getFirestore();
        const citiesCollectionRef = collection(db, "cities");
        const queryPrice = queryParams.get("pris");
        const cityQuery = queryParams.get("city");

        const cityFormLocalStorage = JSON.parse(
          localStorage.getItem("city") || "[]"
        );
        const subCityFormLocalStorage = JSON.parse(
          localStorage.getItem("subcity") || "[]"
        );

        const cleanedCities =
          cityQuery
            ?.split(",")
            .map((city) => city.trim().replace(/\s*\(\d+\)/, "")) || [];

        const citiesToUse =
          cityFormLocalStorage.length > 0
            ? cityFormLocalStorage
            : cleanedCities;

        setFormData((prev) => ({
          ...prev,
          Område: citiesToUse,
          SubOmråde:
            subCityFormLocalStorage.length > 0 ? subCityFormLocalStorage : [],
        }));

        const soveromFormLocalStorage = JSON.parse(
          localStorage.getItem("soverom") || "[]"
        );
        const soveromValues = soveromFormLocalStorage.map((item: any) =>
          parseInt(item.replace(" Soverom", ""), 10)
        );
        const HustypeFormLocalStorage = JSON.parse(
          localStorage.getItem("Hustype") || "[]"
        );

        setFormData((prev) => ({
          ...prev,
          AntallSoverom: soveromFormLocalStorage,
          Hustype: HustypeFormLocalStorage,
        }));

        const maxRangePlot: any = queryParams.get("maxRangePlot");
        const maxRangeHusmodell = queryParams.get("maxRangeHusmodell");

        const citiesSnapshot = await getDocs(citiesCollectionRef);
        const fetchedCities = citiesSnapshot.docs.map((doc) => ({
          propertyId: doc.id,
          ...doc.data(),
        }));

        const matchedCities = fetchedCities.filter((property: any) =>
          citiesToUse.includes(property.name)
        );

        if (!matchedCities.length) {
          setHouseModelProperty([]);
          return;
        }

        // const kommuneNumbers = matchedCities
        //   .flatMap((property: any) =>
        //     Object.values(property?.kommunenummer).map((value: any) =>
        //       parseInt(
        //         (typeof value === "string"
        //           ? value.replace(/"/g, "")
        //           : value
        //         ).toString(),
        //         10
        //       )
        //     )
        //   )
        //   .filter((num) => !isNaN(num));

        let kommuneNumbers: number[] = [];

        if (subCityFormLocalStorage.length > 0) {
          kommuneNumbers = matchedCities
            .flatMap((property: any) => {
              const matchedNumbers = property.kommunerList
                .filter((k: any) => subCityFormLocalStorage.includes(k.name))
                .map((k: any) => parseInt(k.number, 10));

              if (matchedNumbers.length === 0) {
                return Object.values(property?.kommunenummer).map(
                  (value: any) =>
                    parseInt(
                      (typeof value === "string"
                        ? value.replace(/"/g, "")
                        : value
                      ).toString(),
                      10
                    )
                );
              }

              return matchedNumbers;
            })
            .filter((num) => !isNaN(num));
        } else {
          kommuneNumbers = matchedCities
            .flatMap((property: any) =>
              Object.values(property?.kommunenummer).map((value: any) =>
                parseInt(
                  (typeof value === "string"
                    ? value.replace(/"/g, "")
                    : value
                  ).toString(),
                  10
                )
              )
            )
            .filter((num) => !isNaN(num));
        }

        if (!kommuneNumbers.length) {
          setHouseModelProperty([]);
          return;
        }

        const husmodellRef = collection(db, "house_model");
        const allHusmodell = (await getDocs(husmodellRef)).docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredHusmodell = queryPrice
          ? allHusmodell.filter((plot: any) => {
              const price = parseInt(
                plot?.Husdetaljer?.pris.replace(/\s/g, ""),
                10
              );
              const maxPrice = maxRangeHusmodell
                ? parseInt(maxRangeHusmodell)
                : parseInt(queryPrice.replace(/\s/g, ""), 10) * 0.4;
              return (
                price <= maxPrice &&
                (soveromValues.length > 0
                  ? soveromValues.includes(plot?.Husdetaljer?.Soverom)
                  : true) &&
                (HustypeFormLocalStorage.length > 0
                  ? HustypeFormLocalStorage.map((item: any) =>
                      item.toLowerCase()
                    ).includes(plot?.Husdetaljer?.TypeObjekt?.toLowerCase())
                  : true)
              );
            })
          : allHusmodell;

        const plotsRef = collection(db, "empty_plot");
        const allPlots: any = [];
        const chunkSize = 10;

        for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
          const chunk = kommuneNumbers.slice(i, i + chunkSize);
          const q = query(
            plotsRef,
            where(
              "lamdaDataFromApi.searchParameters.kommunenummer",
              "in",
              chunk
            )
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data?.CadastreDataFromApi?.presentationAddressApi)
              allPlots.push({ id: doc.id, ...data });
          });
        }

        const filteredPlots = queryPrice
          ? allPlots.filter(
              (plot: any) =>
                plot.pris <=
                (maxRangePlot && parseInt(maxRangePlot, 10)
                  ? Number(maxRangePlot)
                  : parseInt(queryPrice, 10) * 0.6)
            )
          : allPlots;

        const combinedData = filteredPlots.flatMap((plot: any) =>
          filteredHusmodell.map((house) => ({ plot, house }))
        );

        setHouseModelProperty(combinedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [router.asPath]);

  return (
    <>
      <div className="bg-lightPurple2 py-4">
        <SideSpaceContainer>
          <div className="flex items-center gap-1">
            <Link href={"/"} className="text-[#7839EE] text-sm font-medium">
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-sm">
              Start med tomt og husmodell
            </span>
          </div>
        </SideSpaceContainer>
      </div>
      <div className="relative pt-8">
        <SideSpaceContainer>
          <div className="flex items-end justify-between gap-4 mb-[40px]">
            <h3 className="text-darkBlack text-lg md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              Kombinasjoner av <span className="font-bold">husmodell</span> og{" "}
              <span className="font-bold">tomt</span>{" "}
              {formData?.Område.length > 1 ? null : (
                <>
                  i{" "}
                  <span className="font-bold text-blue">
                    {formData?.Område[0]}
                  </span>
                </>
              )}
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">2 206</span> Tomter
              </p>
            )}
          </div>
          <div className="flex gap-6 relative pb-[56px]">
            <div className="w-[35%]">
              <BelopFilterSection
                formData={formData}
                setFormData={setFormData}
              />
            </div>
            <div className="w-[65%]">
              <BelopProperty
                HouseModelProperty={HouseModelProperty}
                isLoading={isLoading}
              />
            </div>
          </div>
        </SideSpaceContainer>
        <div
          className="sticky bottom-0 bg-white p-6"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          }}
        >
          <div className="flex justify-end items-center gap-6">
            <Button
              text="Tilbake"
              className="border-2 border-[#6941C6] bg-white text-[#6941C6] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold desktop:px-[20px] relative desktop:py-[16px]"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Belop;
