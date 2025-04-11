import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Button from "@/components/common/button";
import Loader from "@/components/Loader";
import Link from "next/link";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Ic_phone from "@/public/images/Ic_phone.svg";
import Ic_mail from "@/public/images/Ic_mail.svg";
import Tilbudsdetaljer from "@/components/Ui/husmodellPlot/Tilbudsdetaljer";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import Ic_spareBank from "@/public/images/Ic_spareBank.svg";
import Ic_Info_gray from "@/public/images/Ic_Info_gray.svg";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import Ic_contact from "@/public/images/Ic_contact.svg";

const Oppsummering: React.FC<{
  handleNext: any;
  lamdaDataFromApi: any;
  loadingLamdaData: any;
  CadastreDataFromApi: any;
  askData: any;
  HouseModelData: any;
  handlePrevious: any;
  supplierData: any;
}> = ({
  handleNext,
  lamdaDataFromApi,
  askData,
  loadingLamdaData,
  CadastreDataFromApi,
  HouseModelData,
  handlePrevious,
  supplierData,
}) => {
  const router = useRouter();
  const { homePage } = router.query;
  const { query } = router;
  const updatedQuery = { ...query };

  const Husdetaljer = HouseModelData?.Husdetaljer;

  const [custHouse, setCusHouse] = useState<any>(null);
  useEffect(() => {
    const customizeHouse = localStorage.getItem("customizeHouse");
    if (customizeHouse) {
      setCusHouse(JSON.parse(customizeHouse));
    }
  }, []);

  const totalCustPris = custHouse?.reduce(
    (sum: any, item: any) =>
      sum + Number(item?.product?.pris.replace(/\s/g, "")),
    0
  );
  const validationSchema = Yup.object().shape({
    existingLoan: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    previousExperience: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    collateral: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    permissions: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    buffer: Yup.string()
      .oneOf(["Ja", "Nei"], "Please select an option")
      .required("Påkrevd"),
    equityAmount: Yup.number()
      .typeError("Must be a number")
      .min(1, "Amount must be greater than 0")
      .optional(),
    sharingData: Yup.boolean()
      .oneOf([true], "You must accept the sharing data")
      .required("Påkrevd"),
    Isopt: Yup.boolean()
      .oneOf([true], "You must accept this")
      .required("Påkrevd"),
  });

  const leadId = router.query["leadId"];

  const handleSubmit = async (values: any) => {
    const bankValue = values;

    try {
      if (leadId) {
        await updateDoc(doc(db, "leads", String(leadId)), {
          IsoptForBank: true,
          updatedAt: new Date(),
          bankValue,
        });
        toast.success("Update Lead successfully.", { position: "top-right" });
      } else {
        toast.error("Lead id not found.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Firestore update operation failed:", error);
    }
  };

  const [isContactChecked, setIsContactChecked] = useState(false);
  const handleContactCheckboxChange = () => {
    setIsContactChecked(!isContactChecked);
  };
  const validationContactSchema = Yup.object().shape({
    contactCheckbox: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });

  const handleContactSubmit = async (values: any) => {
    console.log(values);
  };
  if (loadingLamdaData) {
    <Loader />;
  }
  return (
    <div className="relative">
      <div className="bg-lightPurple2 py-4">
        <SideSpaceContainer>
          <div className="flex items-center gap-1 mb-6">
            <Link href={"/"} className="text-[#DF761F] text-sm font-medium">
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#DF761F] text-sm font-medium cursor-pointer"
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
                  className="text-[#DF761F] text-sm font-medium cursor-pointer"
                  onClick={() => {
                    delete updatedQuery.propertyId;
                    delete updatedQuery.husodellId;
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
              className="text-[#DF761F] text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 2;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Detaljer
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#DF761F] text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 3;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Tilpass
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#DF761F] text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 4;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Tilbud
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-[#DF761F] text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 5;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
              }}
            >
              Finansiering
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-sm">Oppsummering</span>
          </div>
          <PropertyHouseDetails
            HouseModelData={HouseModelData}
            lamdaDataFromApi={lamdaDataFromApi}
            supplierData={supplierData}
          />
        </SideSpaceContainer>
      </div>
      <PropertyDetails
        askData={askData}
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
      />

      <div className="pt-6 pb-8">
        <SideSpaceContainer>
          <h5 className="text-darkBlack text-xl font-semibold mb-4">
            Tilbudsdetaljer
          </h5>
          <Tilbudsdetaljer />
          <div className="my-8">
            <Formik
              initialValues={{
                existingLoan: "",
                previousExperience: "",
                collateral: "",
                permissions: "",
                buffer: "",
                equityAmount: "",
                sharingData: false,
                Isopt: false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => {
                useEffect(() => {
                  (async () => {
                    try {
                      const docSnap = await getDoc(
                        doc(db, "leads", String(leadId))
                      );

                      if (docSnap.exists()) {
                        const data = docSnap.data();

                        const value = data?.bankValue;
                        setFieldValue(
                          "sharingData",
                          data.IsoptForBank || false
                        );
                        setFieldValue("Isopt", data.Isopt || false);
                        setFieldValue(
                          "existingLoan",
                          value?.existingLoan || ""
                        );
                        setFieldValue(
                          "previousExperience",
                          value?.previousExperience || ""
                        );
                        setFieldValue("collateral", value?.collateral || "");
                        setFieldValue("permissions", value?.permissions || "");
                        setFieldValue("buffer", value?.buffer || "");
                        setFieldValue("equityAmount", value?.equityAmount);
                      }
                    } catch (error) {
                      console.error(
                        "Error fetching IsoptForBank status:",
                        error
                      );
                    }
                  })();
                }, [leadId]);
                return (
                  <Form>
                    <div className="w-full flex gap-[24px]">
                      <div className="w-[34%] rounded-[8px] border border-[#DCDFEA] h-max">
                        <h3 className="text-darkBlack text-xl p-5 border-b border-[#DCDFEA] font-light">
                          Book et møte med din{" "}
                          <span className="font-semibold">boligkonsulent</span>{" "}
                          fra{" "}
                          <span className="font-semibold">
                            {supplierData?.company_name}
                          </span>
                        </h3>
                        <div className="rounded-[8px] p-5 flex flex-col gap-5 justify-between">
                          <div className="flex flex-col gap-4">
                            <div>
                              <div className="flex gap-3 w-full mb-4">
                                <div className="w-[13%]">
                                  <img
                                    src={supplierData?.createDataBy?.photo}
                                    alt="avatar"
                                    className="w-full"
                                  />
                                </div>
                                <div className="w-[87%]">
                                  <div className="flex mb-3 justify-between w-full items-start">
                                    <div>
                                      <h4 className="text-black mb-1 text-xl font-semibold">
                                        {supplierData?.Kontaktperson}
                                      </h4>
                                      <p className="text-secondary text-base font-medium">
                                        Boligkonsulent
                                      </p>
                                    </div>
                                    <img
                                      src={supplierData?.photo}
                                      alt="logo"
                                      className="w-[108px]"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-between">
                                <div className="flex items-center gap-[6px] text-sm text-secondary">
                                  <Image
                                    fetchPriority="auto"
                                    src={Ic_mail}
                                    alt="mail"
                                  />{" "}
                                  {supplierData?.KontaktpersonEPost}
                                </div>
                                <div className="flex items-center gap-[6px] text-sm text-secondary">
                                  <Image
                                    fetchPriority="auto"
                                    src={Ic_phone}
                                    alt="phone"
                                  />{" "}
                                  {supplierData?.KontaktpersonMobil}
                                </div>
                              </div>
                            </div>
                            <div className="border w-full border-t border-b-0 border-r-0 border-l-0 border-darkGray"></div>
                            <p className="text-secondary2 text-base">
                              Ved å booke en avtale vil{" "}
                              <span className="font-bold">
                                {supplierData?.Kontaktperson}
                              </span>{" "}
                              hos{" "}
                              <span className="font-bold">
                                {supplierData?.company_name}
                              </span>{" "}
                              ringe deg etter å ha satt seg grundig inn i
                              drømmeboligen din.{" "}
                              <span className="font-bold">
                                {supplierData?.company_name}
                              </span>{" "}
                              vil få tilgang til informasjonen du har lagt igjen
                              her på her på{" "}
                              <span className="font-bold">MinTomt</span> for å
                              sikre en mest mulig effektiv prosess og for å
                              forstå dine ønsker på best mulig måte.
                            </p>
                            <div>
                              <label className="flex items-center gap-[12px] container">
                                <Field type="checkbox" name="Isopt" />
                                <span
                                  className="checkmark checkmark_primary"
                                  style={{ margin: "2px" }}
                                ></span>

                                <div className="text-secondary2 text-sm">
                                  Jeg samtykker til
                                  <span className="text-[#DF761F] font-medium">
                                    {" "}
                                    deling av data
                                  </span>{" "}
                                  med{" "}
                                  <span className="text-black font-medium">
                                    BoligPartner.
                                  </span>
                                </div>
                              </label>
                              {errors.Isopt && touched.Isopt && (
                                <div className="text-red text-sm">
                                  {errors.Isopt}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              text="Kontakt meg"
                              className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                              type="submit"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-[66%]">
                        <div className="flex flex-col gap-4 mb-[40px]">
                          <div className="flex items-center justify-between">
                            <p className="text-secondary2 text-sm font-bold">
                              Totale bygge- og tomtekostnader (inkl. mva)
                            </p>
                            <h4 className="text-black text-xl font-semibold">
                              {formatCurrency(
                                (
                                  totalCustPris +
                                  Number(Husdetaljer?.pris?.replace(/\s/g, ""))
                                ).toLocaleString("nb-NO")
                              )}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-secondary2 text-sm">
                              Egenkapital
                            </p>
                            <div className="flex items-center gap-4">
                              <div>
                                <Field
                                  id="equityAmount"
                                  name="equityAmount"
                                  type="number"
                                  className={`w-[160px] border border-darkGray focus:outline-none text-black rounded-[8px] py-2 px-4 text-sm ${
                                    errors.equityAmount && touched.equityAmount
                                      ? "border-red"
                                      : "border-darkGray"
                                  }`}
                                  placeholder="Enter"
                                />
                                {touched.equityAmount &&
                                  errors.equityAmount && (
                                    <p className="text-red text-xs mt-1">
                                      {errors.equityAmount}
                                    </p>
                                  )}
                              </div>
                              <p className="border-2 border-primary text-primary sm:text-base rounded-[40px] w-max h-[40px] font-medium flex items-center justify-center px-5 cursor-pointer">
                                Legg til
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-secondary text-sm font-bold">
                              Lånebeløp
                            </p>
                            <h4 className="text-black text-xl font-semibold">
                              {(() => {
                                const data: any =
                                  totalCustPris +
                                  Number(Husdetaljer?.pris?.replace(/\s/g, ""));

                                if (values.equityAmount) {
                                  const totalData: any =
                                    Number(data) - Number(values.equityAmount);
                                  const finalData = new Intl.NumberFormat(
                                    "nb-NO"
                                  ).format(totalData);

                                  return formatCurrency(finalData);
                                } else {
                                  return formatCurrency(
                                    (
                                      totalCustPris +
                                      Number(
                                        Husdetaljer?.pris?.replace(/\s/g, "")
                                      )
                                    ).toLocaleString("nb-NO")
                                  );
                                }
                              })()}
                            </h4>
                          </div>
                        </div>
                        <div className="rounded-[8px] border border-[#DCDFEA]">
                          <div className="flex items-center justify-between border-b border-[#DCDFEA] p-5">
                            <h3 className="text-black text-xl font-semibold">
                              Søk byggelån{" "}
                              {(() => {
                                const data: any =
                                  totalCustPris +
                                  Number(Husdetaljer?.pris?.replace(/\s/g, ""));

                                if (values.equityAmount) {
                                  const totalData: any =
                                    Number(data) - Number(values.equityAmount);
                                  const finalData = new Intl.NumberFormat(
                                    "nb-NO"
                                  ).format(totalData);

                                  return formatCurrency(finalData);
                                } else {
                                  return formatCurrency(
                                    (
                                      totalCustPris +
                                      Number(
                                        Husdetaljer?.pris?.replace(/\s/g, "")
                                      )
                                    ).toLocaleString("nb-NO")
                                  );
                                }
                              })()}{" "}
                              hos:
                            </h3>
                            <Image
                              fetchPriority="auto"
                              src={Ic_spareBank}
                              alt="icon"
                              className="w-[119px] h-[30px]"
                            />
                          </div>
                          <div className="flex flex-col gap-4 p-5 border-b border-[#DCDFEA]">
                            <div className="flex items-center justify-between">
                              <div className="text-secondary2 text-sm">
                                Nominell rente fra
                              </div>
                              <h6 className="text-black font-medium text-base">
                                8,75%
                              </h6>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-secondary2 text-sm">
                                Effektiv rente ved byggelån ved 2 MNOK ved 100%
                                utnyttelse
                              </div>
                              <h6 className="text-black font-medium text-base">
                                11,01%
                              </h6>
                            </div>
                            <div className="border-t w-full border-[#DCDFEA]"></div>
                            <div className="flex items-center justify-between">
                              <div className="text-secondary2 text-base font-bold">
                                Estimert kostnad per måned
                              </div>
                              <h6 className="text-black font-medium text-xl">
                                48.667 NOK
                              </h6>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="flex items-center container">
                                  <Field type="checkbox" name="sharingData" />

                                  <span
                                    className="checkmark checkmark_primary"
                                    style={{ margin: "2px" }}
                                  ></span>

                                  <div className="text-secondary2 text-sm">
                                    Jeg samtykker til{" "}
                                    <span className="text-[#DF761F] font-bold">
                                      deling av data
                                    </span>{" "}
                                    med{" "}
                                    <span className="text-secondary2 font-bold">
                                      SpareBank1 Hallingdal Valdres.
                                    </span>
                                  </div>
                                </label>
                                {touched.sharingData && errors.sharingData && (
                                  <p className="text-red text-xs mt-1">
                                    {errors.sharingData}
                                  </p>
                                )}
                              </div>
                              <Button
                                text="Send inn lånesøknad"
                                className="border-2 border-primary text-primary sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[40px] font-medium desktop:px-[20px] relative desktop:py-[16px]"
                                type="submit"
                              />
                            </div>
                            <div className="flex items-start gap-3 mt-5">
                              <Image
                                fetchPriority="auto"
                                src={Ic_Info_gray}
                                alt="icon"
                              />
                              <p className="text-secondary2 text-sm">
                                Loan facility for construction of a home/holiday
                                home. Will be converted into a repayment loan
                                upon completion of the home/holiday home.
                                Interest rate will vary based on an overall
                                assessment of payment ability and security.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className="mb-8 border border-[#DCDFEA] rounded-[8px]">
            <h4 className="text-darkBlack text-xl border-b border-[#DCDFEA] p-5">
              Vil du at{" "}
              <span className="font-semibold">EIE Eiendomsmegling</span>
              EIE Eiendomsmegling skal gi deg en forhåndstakst på prosjektet?
            </h4>
            <div className="p-5">
              <Formik
                initialValues={{ contactCheckbox: false }}
                validationSchema={validationContactSchema}
                onSubmit={handleContactSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="flex flex-col h-full gap-6">
                    <div className="flex gap-6">
                      <div className="flex items-start gap-3 w-1/2">
                        <Image
                          fetchPriority="auto"
                          src={Ic_Info_gray}
                          alt="icon"
                        />
                        <p className="text-secondary2 text-sm">
                          Et byggelån krever et forhåndsestimat av prosjektet.
                          Hvis <span className="font-bold">e-taksten</span> er
                          høyere enn byggekostnaden, kan du bruke dette som
                          egenkapital overfor banken.
                        </p>
                      </div>
                      <div className="border-l border-[#DCDFEA]"></div>
                      <div className="w-1/2">
                        <label className="flex items-center gap-[12px] container">
                          <Field
                            type="checkbox"
                            name="contactCheckbox"
                            checked={isContactChecked}
                            onChange={() => {
                              setFieldValue(
                                "contactCheckbox",
                                !values.contactCheckbox
                              );
                              handleContactCheckboxChange();
                            }}
                          />
                          <span
                            className="checkmark checkmark_primary"
                            style={{ margin: "2px" }}
                          ></span>
                          <div className="text-secondary2 text-sm">
                            Jeg samtykker i å{" "}
                            <span className="font-bold text-[#DF761F]">
                              dele data
                            </span>{" "}
                            med{" "}
                            <span className="font-bold">
                              Eie Eiendomsmegling,
                            </span>
                            slik at de kan kontakte meg for en{" "}
                            <span className="font-bold">
                              forhåndstakst av prosjektet
                            </span>{" "}
                            og en{" "}
                            <span className="font-bold">
                              verdivurdering av min nåværende bolig.
                            </span>{" "}
                            Dette gir totalt sett et bilde av egenkapitalen som
                            kan være nødvendig for å få innvilget et byggelån.
                          </div>
                        </label>
                        {errors.contactCheckbox && touched.contactCheckbox && (
                          <div className="text-red text-sm">
                            {errors.contactCheckbox}
                          </div>
                        )}
                      </div>
                      <Image fetchPriority="auto" src={Ic_contact} alt="icon" />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        text="Send til EIE"
                        className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                        type="submit"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
      <div
        className="sticky bottom-0 bg-white py-6"
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
              onClick={() => {
                handlePrevious();
              }}
            />
            <Button
              text={`Send til ${supplierData?.company_name}`}
              className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
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

export default Oppsummering;
