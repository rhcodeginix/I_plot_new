import React, { useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Link from "next/link";
import Image from "next/image";
import HouseDetailsection from "@/components/Ui/houseDetail/houseDetailSection";
import Loader from "@/components/Loader";
import HouseDetailPage from "@/components/Ui/houseDetail";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";

const HusmodellDetail: React.FC<{
  handleNext: any;
  HouseModelData: any;
  loading: any;
  pris: any;
  lamdaDataFromApi: any;
  supplierData: any;
}> = ({
  handleNext,
  HouseModelData,
  loading,
  pris,
  lamdaDataFromApi,
  supplierData,
}) => {
  const tabs: any = [
    {
      id: `house`,
      label: "Husmodellinformasjon",
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="relative">
        <div className="bg-lightBlue py-2 md:py-4">
          <SideSpaceContainer>
            <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
              <Link
                href={"/"}
                className="text-primary text-xs md:text-sm font-medium"
              >
                Hjem
              </Link>
              <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              <span className="text-secondary2 text-xs md:text-sm">
                Husmodell
              </span>
            </div>
            <PropertyHouseDetails
              HouseModelData={HouseModelData}
              lamdaDataFromApi={lamdaDataFromApi}
              supplierData={supplierData}
              pris={pris}
            />
          </SideSpaceContainer>
        </div>
        <HouseDetailsection HouseModelData={HouseModelData} loading={loading} />
        <SideSpaceContainer className="relative pt-[38px]">
          <div>
            <div className="flex border border-gray3 rounded-lg w-max bg-gray3 p-[6px] mb-[38px]">
              {tabs.map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-base transition-colors duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-white font-medium text-primary"
                      : "text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={`${activeTab === "house" ? "block" : "hidden"}`}>
              <HouseDetailPage />
            </div>
          </div>
        </SideSpaceContainer>
        <div
          className="sticky bottom-0 bg-white py-4 md:py-6"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
            zIndex: 9999,
          }}
        >
          <SideSpaceContainer>
            <div className="flex justify-end gap-4 items-center">
              <Button
                text="Tilbake"
                className="border-2 border-primary text-primary sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                path="/"
              />
              <Button
                text="Neste: Tilpass"
                className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  handleNext();
                }}
              />
            </div>
          </SideSpaceContainer>
        </div>
      </div>
    </>
  );
};

export default HusmodellDetail;
