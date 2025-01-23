import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import AllProperty from "@/components/Ui/RegulationHusmodell/allProperty";
import { useRouter } from "next/router";
import PropertyDetailPage from "@/components/Ui/RegulationHusmodell/propertyDetailPage";

const Husmodell: React.FC<any> = ({ handleNext, handlePrevious }) => {
  const [propertyAllDetail, setPropertyAllDetail] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (router.query["regulation-details"]) {
      setPropertyAllDetail(true);
    }
  }, [router.query]);

  return (
    <div className="relative">
      {propertyAllDetail ? (
        <PropertyDetailPage
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      ) : (
        <SideSpaceContainer className="relative">
          <AllProperty />
        </SideSpaceContainer>
      )}
    </div>
  );
};

export default Husmodell;
