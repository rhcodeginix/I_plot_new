import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Button from "@/components/common/button";
import PlotFilterSection from "./plotFilterSection";
import PlotProperty from "./plotProperty";
import { Settings2, X } from "lucide-react";
import { Drawer } from "@mui/material";
import { db } from "@/config/firebaseConfig";

const Plots: React.FC<{
  handlePrevious: any;
  // handleNext: any;
  HouseModelData: any;
  setLamdaDataFromApi: any;
  setCadastreDataFromApi: any;
  setAdditionalData: any;
}> = ({
  handlePrevious,
  //  handleNext,
  HouseModelData,
  setLamdaDataFromApi,
  setCadastreDataFromApi,
  setAdditionalData,
}) => {
  const router: any = useRouter();
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlots = HouseModelProperty.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const [formData, setFormData] = useState({
    address: "",
    minRangeForPlot: 0,
    maxRangeForPlot: 10000000,
    Område: [] as string[],
    SubOmråde: [] as string[],
  });
  useEffect(() => {
    setLamdaDataFromApi(null);
    setCadastreDataFromApi(null);
    setAdditionalData(null);
  }, []);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const maxRangePlot = queryParams.get("maxRangePlot");
    const minRangePlot = queryParams.get("minRangePlot");

    setFormData((prev) => ({
      ...prev,
      maxRangeForPlot: maxRangePlot
        ? Number(maxRangePlot)
        : prev.maxRangeForPlot,
      minRangeForPlot: minRangePlot
        ? Number(minRangePlot)
        : prev.minRangeForPlot,
    }));
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const minRangePlot = Number(queryParams.get("minRangePlot") || 0);
        const maxRangePlot = Number(
          queryParams.get("maxRangePlot") || Infinity
        );

        const husmodellId = queryParams.get("husmodellId");
        const cityQuery = queryParams.get("city");
        if (cityQuery) {
          const db = getFirestore();
          const citiesCollectionRef = collection(db, "cities");

          const cityFormLocalStorage: string[] = JSON.parse(
            localStorage.getItem("city") || "[]"
          );
          const subCityFormLocalStorage: string[] = JSON.parse(
            localStorage.getItem("subcity") || "[]"
          );

          const cleanedCities =
            cityQuery?.split(",").map((city) => city.trim()) || [];

          const citiesToUse =
            cityFormLocalStorage.length > 0
              ? cityFormLocalStorage
              : cleanedCities;

          setFormData((prev) => ({
            ...prev,
            // Område: citiesToUse,
            Område: citiesToUse.length > 0 ? citiesToUse : prev.Område,
            SubOmråde:
              subCityFormLocalStorage.length > 0 ? subCityFormLocalStorage : [],
          }));
          const citiesSnapshot = await getDocs(citiesCollectionRef);
          const allCities = citiesSnapshot.docs.map((doc) => ({
            propertyId: doc.id,
            ...doc.data(),
          }));

          const matchedCities = allCities.filter((property: any) =>
            citiesToUse.includes(property.name)
          );

          if (!matchedCities.length) {
            setHouseModelProperty([]);
            return;
          }

          const kommuneNumbers: number[] = matchedCities
            .flatMap((city: any) => {
              if (subCityFormLocalStorage.length > 0) {
                const matched =
                  city.kommunerList?.filter((k: any) =>
                    subCityFormLocalStorage.includes(k.name)
                  ) || [];

                if (matched.length > 0) {
                  return matched.map((k: any) => parseInt(k.number, 10));
                }
              }

              return Object.values(city.kommunenummer).map((val: any) =>
                parseInt(
                  typeof val === "string"
                    ? val.replace(/"/g, "")
                    : val.toString(),
                  10
                )
              );
            })
            .filter((num: any) => !isNaN(num));

          if (!kommuneNumbers.length) {
            setHouseModelProperty([]);
            return;
          }

          const husmodellDocRef = doc(db, "house_model", String(husmodellId));
          const husmodellSnap = await getDoc(husmodellDocRef);

          if (!husmodellSnap.exists()) {
            console.error("No such house model document!");
            setHouseModelProperty([]);
            return;
          }

          const allHusmodell = [
            {
              propertyId: husmodellSnap.id,
              ...husmodellSnap.data(),
            },
          ];

          const plotsRef = collection(db, "cabin_plot");
          const chunkSize = 10;
          const allPlots: any[] = [];

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
              if (data?.CadastreDataFromApi?.presentationAddressApi) {
                allPlots.push({ id: doc.id, ...data });
              }
            });
          }

          const filteredPlots = allPlots.filter((plot) => {
            let numericValue = 0;

            if (typeof plot.pris === "string") {
              numericValue = parseInt(
                plot.pris.replace(/\s/g, "").replace("kr", ""),
                10
              );
            } else if (typeof plot.pris === "number") {
              numericValue = plot.pris;
            } else {
              numericValue = 0;
            }

            return (
              numericValue >= minRangePlot &&
              (maxRangePlot !== 10000000 ? numericValue <= maxRangePlot : true)
            );
          });

          const combinedData: any = filteredPlots.flatMap((plot) =>
            allHusmodell.map((house) => ({ plot, house }))
          );

          setHouseModelProperty(combinedData);
        } else {
          const [cityFormLocalStorage, subCityFormLocalStorage] = [
            JSON.parse(localStorage.getItem("city") || "[]"),
            JSON.parse(localStorage.getItem("subcity") || "[]"),
          ];
          const citiesSnapshot = await getDocs(collection(db, "cities"));
          const fetchedCities = citiesSnapshot.docs.map((doc) => ({
            propertyId: doc.id,
            ...doc.data(),
          }));

          const citiesToUse =
            cityFormLocalStorage.length > 0
              ? cityFormLocalStorage
              : fetchedCities.map((city: any) => city.name);

          const matchedCities = fetchedCities.filter((property: any) =>
            citiesToUse.includes(property.name)
          );

          setFormData((prev) => ({
            ...prev,
            // Område: cityFormLocalStorage || 0,
            Område:
              cityFormLocalStorage.length > 0
                ? cityFormLocalStorage
                : prev.Område,
            SubOmråde: subCityFormLocalStorage,
          }));

          if (!matchedCities.length) {
            setHouseModelProperty([]);
            return;
          }

          let kommuneNumbers: number[] = [];

          matchedCities.forEach((property: any) => {
            if (subCityFormLocalStorage.length > 0) {
              const matched = property.kommunerList?.filter((k: any) =>
                subCityFormLocalStorage.includes(k.name)
              );
              if (matched?.length) {
                kommuneNumbers.push(
                  ...matched.map((k: any) => parseInt(k.number, 10))
                );
              }
            } else {
              // Use all subkommuner under the city
              kommuneNumbers.push(
                ...(property.kommunerList || []).map((k: any) =>
                  parseInt(k.number, 10)
                )
              );
            }
          });

          // kommuneNumbers = kommuneNumbers.filter((num) => !isNaN(num));
          kommuneNumbers = [...new Set(kommuneNumbers)].filter(
            (num) => !isNaN(num)
          );

          if (!kommuneNumbers.length) {
            setHouseModelProperty([]);
            return;
          }

          const plotChunks = [];

          const chunkSize = 10;

          for (let i = 0; i < kommuneNumbers.length; i += chunkSize) {
            const chunk = kommuneNumbers.slice(i, i + chunkSize);

            const shouldLimitResults =
              cityFormLocalStorage.length === 0 &&
              subCityFormLocalStorage.length === 0 &&
              !maxRangePlot;

            const constraints: any = [
              where(
                "lamdaDataFromApi.searchParameters.kommunenummer",
                "in",
                chunk
              ),
            ];

            if (shouldLimitResults) {
              constraints.push(limit(20));
            }

            const q = query(collection(db, "cabin_plot"), ...constraints);
            plotChunks.push(getDocs(q));
          }

          const husmodellDocRef = doc(db, "house_model", String(husmodellId));
          const husmodellSnap = await getDoc(husmodellDocRef);

          if (!husmodellSnap.exists()) {
            console.error("No such house model document!");
            setHouseModelProperty([]);
            return;
          }

          const allHusmodell = [
            {
              propertyId: husmodellSnap.id,
              ...husmodellSnap.data(),
            },
          ];

          const [...plotSnapshots] = await Promise.all([...plotChunks]);

          const allPlots = plotSnapshots.flatMap((snapshot) =>
            snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter(
                (data: any) => data?.CadastreDataFromApi?.presentationAddressApi
              )
          );

          const filteredPlots = allPlots.filter((plot: any) => {
            let numericValue = 0;

            if (typeof plot.pris === "string") {
              numericValue = parseInt(
                plot.pris.replace(/\s/g, "").replace("kr", ""),
                10
              );
            } else if (typeof plot.pris === "number") {
              numericValue = plot.pris;
            } else {
              numericValue = 0;
            }

            return (
              numericValue >= minRangePlot &&
              (maxRangePlot !== 10000000 ? numericValue <= maxRangePlot : true)
            );
          });

          const combinedData: any = filteredPlots.flatMap((plot: any) =>
            allHusmodell.map((house) => ({ plot, house }))
          );

          setHouseModelProperty(combinedData);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [router.asPath]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open);
  };

  useEffect(() => {
    const chatBot = document.getElementById("chatbase-bubble-button");
    const addPlot = document.getElementById("addPlot");
    const navbar = document.getElementById("navbar");

    if (openDrawer) {
      if (chatBot) chatBot.style.display = "none";
      if (addPlot) addPlot.style.display = "none";
      if (navbar) navbar.style.zIndex = "999";
    } else {
      if (chatBot) chatBot.style.display = "block";
      if (addPlot) addPlot.style.display = "block";
      if (navbar) navbar.style.zIndex = "9999";
    }
  }, [openDrawer]);
  return (
    <>
      <div className="relative pt-5 md:pt-8">
        <SideSpaceContainer>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 md:gap-3 lg:gap-4 mb-6 lg:mb-[40px]">
            <h3 className="text-darkBlack text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px]">
              <span className="font-bold">Tomter</span> der du kan bygge{" "}
              <span className="text-primary font-bold">
                {HouseModelData?.Husdetaljer?.husmodell_name}
              </span>
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i{" "}
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                annonser
              </p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-5 laptop:gap-6 relative pb-[56px]">
            <div className="lg:w-[35%]">
              <div
                className="sticky top-[56px] w-max left-0 right-0 z-50 bg-white border rounded-lg border-[#DADDE8] p-2 gap-2 flex items-center justify-between lg:hidden"
                onClick={toggleDrawer(true)}
              >
                <Settings2 className="text-primary h-5 w-5" />
                <h4 className="text-sm">Filter</h4>
              </div>
              <div className="hidden lg:block w-full">
                <PlotFilterSection
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>

            <div className="w-full lg:w-[65%]">
              <PlotProperty
                HouseModelProperty={currentPlots}
                isLoading={isLoading}
                // handleNext={handleNext}
              />
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Forrige
                </button>
                <span className="px-4 py-2">{currentPage}</span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < Math.ceil(HouseModelProperty.length / itemsPerPage)
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(HouseModelProperty.length / itemsPerPage)
                  }
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Neste
                </button>
              </div>
            </div>
          </div>
        </SideSpaceContainer>

        <div
          className="sticky bottom-0 bg-white py-4"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
            zIndex: 999999,
          }}
        >
          <SideSpaceContainer>
            <div className="flex justify-end gap-4 items-center">
              <Button
                text="Tilbake"
                className="border-2 border-primary text-primary hover:border-[#1E5F5C] hover:text-[#1E5F5C] focus:border-[#003A37] focus:text-[#003A37] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                onClick={() => {
                  handlePrevious();
                }}
              />
            </div>
          </SideSpaceContainer>
        </div>
      </div>

      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "90vh",
          },
          className: "filterDrawer",
        }}
      >
        <div className="overflow-y-auto max-h-[90vh] pt-4 bg-lightPurple2">
          <PlotFilterSection formData={formData} setFormData={setFormData} />
          <div className="absolute top-3 right-2" onClick={toggleDrawer(false)}>
            <X className="h-4 w-4" />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Plots;
