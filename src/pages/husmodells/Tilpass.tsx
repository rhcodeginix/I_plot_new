import React, { useEffect, useRef, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Button from "@/components/common/button";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Ic_info_circle from "@/public/images/Ic_info_circle.svg";
import Link from "next/link";
import Ic_close from "@/public/images/Ic_close.svg";
import { formatCurrency } from "@/components/Ui/RegulationHusmodell/Illustrasjoner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import { useCustomizeHouse } from "@/context/selectHouseContext";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import LoginForm from "../login/loginForm";
import VippsButton from "@/components/vipps";
import Img_vipps_login from "@/public/images/Img_vipps_login.png";
import { useRouter } from "next/router";
import { convertCurrencyFormat } from "@/components/Ui/Husmodell/plot/plotProperty";
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

const Tilpass: React.FC<any> = ({
  handleNext,
  handlePrevious,
  loading,
  HouseModelData,
  lamdaDataFromApi,
  supplierData,
  pris,
  loginUser,
  isPopupOpen,
  setIsPopupOpen,
  setIsCall,
  user,
}) => {
  const Huskonfigurator =
    HouseModelData?.Huskonfigurator?.hovedkategorinavn || [];
  const { customizeHouse: custHouse, updateCustomizeHouse } =
    useCustomizeHouse();
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    }
  }, []);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  useEffect(() => {
    setTimeout(() => {
      document.querySelector(".swiper-pagination")?.classList.add("active");
    }, 100);
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerProduct, setSelectedDrawerProduct] = useState<any>(null);

  const openDrawer = (product: any) => {
    setSelectedDrawerProduct(product);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerProduct(null);
  };
  const textareaRef = useRef<any>(null);
  useEffect(() => {
    setSelectedCategory(0);
  }, [selectedTab]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [selectedDrawerProduct]);
  const [selectedProductsArray, setSelectedProductsArray] = useState<any[]>([]);

  const [selectedProducts, setSelectedProducts] = useState<any>({});

  useEffect(() => {
    if (Huskonfigurator?.length > 0) {
      const defaultSelectedProducts: any = {};
      const defaultSelectedProductsArray: any[] = [];

      Huskonfigurator.forEach((selectedTab: any, index: number) => {
        if (selectedTab.isSelected && selectedTab.Kategorinavn?.length > 0) {
          selectedTab.Kategorinavn.forEach(
            (categoryItem: any, categoryIndex: number) => {
              if (
                categoryItem?.isSelected === true &&
                categoryItem.produkter?.length > 0
              ) {
                const product = categoryItem.produkter[0];
                const key = `${index}-${categoryIndex}`;

                defaultSelectedProducts[key] = {
                  category: index,
                  subCategory: categoryIndex,
                  product,
                  index: 0,
                };

                defaultSelectedProductsArray.push({
                  category: index,
                  subCategory: categoryIndex,
                  product,
                  index: 1,
                });
              }
            }
          );
        }
      });

      setSelectedProducts(defaultSelectedProducts);
      setSelectedProductsArray(defaultSelectedProductsArray);
    }
  }, [Huskonfigurator]);

  useEffect(() => {
    const stored = localStorage.getItem("customizeHouse");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const mappedProducts: any = {};
          parsed.forEach((item) => {
            const key = `${item.category}-${item.subCategory}`;
            mappedProducts[key] = item;
          });

          setSelectedProductsArray(parsed);
          setSelectedProducts(mappedProducts);
        }
      } catch (error) {
        console.error(
          "Failed to parse customizeHouse from localStorage:",
          error
        );
      }
    }
  }, []);

  // const handleSelectProduct = (
  //   product: any,
  //   categoryIndex: number,
  //   index: number
  // ) => {
  //   const key = `${selectedTab}-${categoryIndex}`;

  //   setSelectedProducts((prev: any) => ({
  //     ...prev,
  //     [key]: {
  //       category: selectedTab,
  //       subCategory: categoryIndex,
  //       product,
  //       index,
  //     },
  //   }));

  //   setSelectedProductsArray((prevArray) => {
  //     const filteredArray = prevArray.filter(
  //       (item) =>
  //         !(item.category === selectedTab && item.subCategory === categoryIndex)
  //     );

  //     return [
  //       ...filteredArray,
  //       { category: selectedTab, subCategory: categoryIndex, product, index },
  //     ];
  //   });
  // };

  const handleSelectProduct = (
    product: any,
    categoryIndex: number,
    index: number
  ) => {
    const key = `${selectedTab}-${categoryIndex}`;
    const currentSelected = selectedProducts[key];

    const isSameProduct =
      currentSelected?.product?.Produktnavn === product.Produktnavn &&
      currentSelected?.product?.pris === product.pris &&
      currentSelected?.product?.IncludingOffer === product.IncludingOffer &&
      currentSelected?.product?.Produktbeskrivelse ===
        product.Produktbeskrivelse;

    if (isSameProduct) {
      const updatedProducts = { ...selectedProducts };
      delete updatedProducts[key];
      setSelectedProducts(updatedProducts);

      const filteredArray = selectedProductsArray.filter(
        (item) =>
          !(
            item.category === selectedTab &&
            item.subCategory === categoryIndex &&
            item.product?.Produktnavn === product.Produktnavn
          )
      );
      setSelectedProductsArray(filteredArray);
    } else {
      setSelectedProducts((prev: any) => ({
        ...prev,
        [key]: {
          category: selectedTab,
          subCategory: categoryIndex,
          product,
          index,
        },
      }));

      setSelectedProductsArray((prevArray) => {
        const filteredArray = prevArray.filter(
          (item) =>
            !(
              item.category === selectedTab &&
              item.subCategory === categoryIndex
            )
        );

        return [
          ...filteredArray,
          { category: selectedTab, subCategory: categoryIndex, product, index },
        ];
      });
    }
  };

  useEffect(() => {
    if (selectedProductsArray) {
      localStorage.setItem(
        "customizeHouse",
        JSON.stringify(selectedProductsArray)
      );
      updateCustomizeHouse(selectedProductsArray);
    }
  }, [selectedProductsArray]);

  const [loginPopup, setLoginPopup] = useState(false);

  const validationLoginSchema = Yup.object().shape({
    terms_condition: Yup.boolean().oneOf([true], "Påkrevd").required("Påkrevd"),
  });
  const router = useRouter();

  const handleLoginSubmit = async () => {
    setIsPopupOpen(false);
    setLoginPopup(true);
    router.push(`${router.asPath}&login_popup=true`);
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  const router_query: any = { ...router.query };

  delete router_query.login_popup;
  const queryString = new URLSearchParams(router_query).toString();

  const totalCustPris = custHouse
    ? custHouse?.reduce(
        (sum: any, item: any) =>
          sum + Number(item?.product?.pris.replace(/\s/g, "")),
        0
      )
    : 0;

  const husPris =
    Number(HouseModelData?.Husdetaljer?.pris?.replace(/\s/g, "")) || 0;
  const extraPris = pris
    ? pris === 0
      ? 0
      : parseInt(String(pris).replace(/\s/g, "").replace("kr", ""), 10)
    : 0;

  const totalPrice = totalCustPris + husPris + extraPris;

  const id = router.query["husmodellId"];

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;

      const queryParams = new URLSearchParams(window.location.search);
      const currentLeadId = queryParams.get("leadId");
      queryParams.delete("leadId");

      try {
        const [husmodellDocSnap] = await Promise.all([
          getDoc(doc(db, "house_model", String(id))),
        ]);

        const finalData = {
          husmodell: { id: String(id), ...husmodellDocSnap.data() },
          plot: null,
        };

        const leadsQuerySnapshot: any = await getDocs(
          query(
            collection(db, "leads"),
            where("finalData.husmodell.id", "==", String(id)),
            where("finalData.plot", "==", null),
            where("user.id", "==", user.id)
          )
        );

        if (!leadsQuerySnapshot.empty) {
          const existingLeadId = leadsQuerySnapshot.docs[0].id;
          await updateDoc(doc(db, "leads", existingLeadId), {
            updatedAt: new Date(),
            ...(user && { user }),
          });

          if (currentLeadId !== existingLeadId) {
            queryParams.set("leadId", existingLeadId);
            router.replace({
              pathname: router.pathname,
              query: Object.fromEntries(queryParams),
            });
          }
          return;
        }

        const newDocRef = await addDoc(collection(db, "leads"), {
          finalData,
          ...(user && { user }),
          Isopt: false,
          IsoptForBank: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        queryParams.set("leadId", newDocRef.id);
        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    if (id && user) {
      fetchData();
    }
  }, [id, user]);

  return (
    <div className="relative">
      <>
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
                Hyttemodell
              </div>
              <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              <span className="text-secondary2 text-xs md:text-sm">
                Tilpass
              </span>
            </div>
            <PropertyHouseDetails
              HouseModelData={HouseModelData}
              lamdaDataFromApi={lamdaDataFromApi}
              supplierData={supplierData}
              loading={loading}
              pris={pris}
              hidden={true}
            />
          </SideSpaceContainer>
        </div>
        <div className="py-5 md:py-8">
          <SideSpaceContainer>
            <h3 className="text-darkBlack text-lg md:text-xl desktop:text-2xl font-semibold mb-[22px]">
              Her gjør du dine tilpasninger:
            </h3>
            {Huskonfigurator?.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6 relative">
                <div className="md:hidden flex gap-2 overflow-x-auto">
                  {Huskonfigurator.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 cursor-pointer border-2 font-medium rounded-lg flex items-center gap-1 my-1 flex-none ${
                        selectedTab === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedTab(index)}
                      style={{
                        boxShadow:
                          "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                      }}
                    >
                      <div className="w-4 md:w-6 h-4 md:h-6">
                        <div
                          className={`w-4 md:w-6 h-4 md:h-6 rounded-full flex items-center justify-center text-xs ${
                            selectedTab === index
                              ? "bg-primary text-white"
                              : "bg-lightPurple2 text-darkBlack"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div className="text-black text-xs md:text-sm font-medium">
                        {item?.navn}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full hidden md:w-[27%] md:flex flex-col gap-3 max-h-[calc(100vh-200px)] sticky top-[88px] overflow-y-auto overFlowYAuto">
                  {Huskonfigurator.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 lg:p-4 cursor-pointer border-2 font-medium rounded-lg flex items-start gap-2 ${
                        selectedTab === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedTab(index)}
                      style={{
                        boxShadow:
                          "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                      }}
                    >
                      <div className="w-6 h-6">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1 ${
                            selectedTab === index
                              ? "bg-primary text-white"
                              : "bg-lightPurple2 text-darkBlack"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <span className="text-black text-sm font-medium mb-2">
                          {item?.navn}
                        </span>
                        <p className="text-secondary2 text-xs md:text-sm">
                          {item?.Beskrivelse}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full md:w-[73%] border h-max border-[#DCDFEA] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between gap-1.5 md:gap-3 p-3 md:p-5 border-b border-[#DCDFEA]">
                    <h3 className="text-darkBlack text-base md:text-lg desktop:text-xl font-semibold one_line_elipse">
                      {Huskonfigurator[selectedTab]?.navn}
                    </h3>
                    {selectedTab < Huskonfigurator.length - 1 && (
                      <Button
                        text="Hopp over steget"
                        className={`border-2 border-primary text-primary hover:border-[#1E5F5C] hover:text-[#1E5F5C] focus:border-[#003A37] focus:text-[#003A37] text-xs sm:text-sm md:text-sm rounded-[40px] w-max h-[36px] md:h-[36px] lg:h-[36px] font-semibold relative`}
                        onClick={() => {
                          setSelectedTab(selectedTab + 1);
                        }}
                      />
                    )}
                  </div>
                  {Huskonfigurator[selectedTab]?.Kategorinavn?.length > 0 ? (
                    <>
                      <div className="bg-[#F9F9FB] border-[#EFF1F5] border rounded-lg m-3 md:m-6 p-[6px] flex items-center gap-1 md:gap-2 overflow-x-auto overFlowScrollHidden">
                        {Huskonfigurator[selectedTab]?.Kategorinavn.map(
                          (catItem: any, catIndex: number) => {
                            return (
                              <div
                                key={catIndex}
                                className={`py-2 px-3 text-xs md:text-sm rounded-lg cursor-pointer whitespace-nowrap ${
                                  selectedCategory === catIndex
                                    ? "bg-white text-primary font-medium shadow-shadow4"
                                    : "bg-transparent text-black"
                                }`}
                                onClick={() => setSelectedCategory(catIndex)}
                              >
                                {catItem?.navn}
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 big:grid-cols-4 gap-3 md:gap-4 desktop:gap-6 p-3 md:p-5 desktop:p-6 pt-0">
                        {Huskonfigurator[selectedTab]?.Kategorinavn[
                          selectedCategory
                        ]?.produkter?.length > 0 &&
                          Huskonfigurator[selectedTab]?.Kategorinavn[
                            selectedCategory
                          ]?.produkter.map((product: any, index: number) => {
                            const key = `${selectedTab}-${selectedCategory}`;

                            const isSelected =
                              selectedProducts[key]?.product?.Produktnavn ===
                                product.Produktnavn &&
                              selectedProducts[key]?.product?.pris ===
                                product.pris &&
                              selectedProducts[key]?.product?.IncludingOffer ===
                                product.IncludingOffer &&
                              selectedProducts[key]?.product
                                ?.Produktbeskrivelse ===
                                product.Produktbeskrivelse;

                            return (
                              <div
                                key={index}
                                className="bg-gray3 rounded-lg p-3 flex flex-col justify-between cursor-pointer"
                                onClick={(e: any) => {
                                  if (
                                    !e.target.closest(".swiper-button-next") &&
                                    !e.target.closest(".swiper-button-prev")
                                  ) {
                                    openDrawer(product);
                                  }
                                }}
                              >
                                <div>
                                  <div className="w-full h-[158px] mb-3 relative">
                                    {product?.Hovedbilde?.length > 0 && (
                                      <Swiper
                                        navigation={
                                          product?.Hovedbilde?.length > 1
                                            ? true
                                            : false
                                        }
                                        modules={[Navigation, Pagination]}
                                        className="custom-swiper w-full h-[158px] relative"
                                        pagination={
                                          product?.Hovedbilde?.length > 1
                                            ? {
                                                el: ".swiper-pagination",
                                                clickable: false,
                                              }
                                            : false
                                        }
                                        style={{ zIndex: 99 }}
                                      >
                                        {product?.Hovedbilde.map(
                                          (img: string, index: number) => (
                                            <SwiperSlide
                                              key={index}
                                              className="w-full h-[158px]"
                                            >
                                              <img
                                                src={img}
                                                alt="image"
                                                className="h-full w-full object-cover rounded-lg"
                                              />
                                            </SwiperSlide>
                                          )
                                        )}
                                        {/* <div className="swiper-pagination"></div> */}
                                      </Swiper>
                                    )}
                                    <div
                                      className="w-[28px] h-[28px] rounded-full flex items-center justify-center cursor-pointer absolute top-2 right-2 bg-white"
                                      style={{ zIndex: 9999 }}
                                      onClick={() => openDrawer(product)}
                                    >
                                      <Image src={Ic_info_circle} alt="icon" />
                                    </div>
                                  </div>
                                  <h3 className="text-darkBlack font-medium text-sm md:text-base lg:text-lg truncate">
                                    {product?.Produktnavn}
                                  </h3>
                                  <p className="text-darkBlack text-xs md:text-sm two_line_elipse mb-1.5 md:mb-3">
                                    {product?.Produktbeskrivelse}
                                  </p>
                                  {/* <div className="relative group">
                                      <p className="text-darkBlack text-xs md:text-sm two_line_elipse mb-1.5 md:mb-3 cursor-pointer">
                                        {product?.Produktbeskrivelse}
                                      </p>
                                      <div
                                        className="absolute hidden group-hover:block bg-white shadow-lg border border-gray p-2 rounded-md w-64 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                        style={{
                                          zIndex: 999,
                                        }}
                                      >
                                        <p className="text-xs text-black">
                                          {product?.Produktbeskrivelse}
                                        </p>
                                      </div>
                                    </div> */}
                                </div>
                                <div className="flex items-center gap-1 justify-between">
                                  <div>
                                    <span className="text-secondary2 text-xs mb-1">
                                      Pris fra:
                                    </span>
                                    <h5 className="text-black font-medium text-sm md:text-base">
                                      {product?.IncludingOffer === true
                                        ? "Standard"
                                        : product?.pris == 0
                                          ? "Kostnadsfritt"
                                          : formatCurrency(product?.pris)}
                                    </h5>
                                  </div>
                                  <Button
                                    text={isSelected ? "Valgt" : "Velg"}
                                    className={`border-2 text-primary ${
                                      isSelected
                                        ? "border-primary bg-lightPurple2"
                                        : "border-[#B9C0D4]"
                                    } text-xs sm:text-sm md:text-sm rounded-[40px] w-max h-[36px] md:h-[36px] lg:h-[36px] font-semibold relative`}
                                    onClick={(
                                      e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                      e.stopPropagation();
                                      handleSelectProduct(
                                        product,
                                        selectedCategory,
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray">
                      Ingen kategorier tilgjengelig
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center py-3 text-lg">
                Du har ikke noe alternativ.
              </p>
            )}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex gap-6 w-max">
                <div>
                  <p className="text-secondary text-xs md:text-sm mb-1">
                    Dine tillegg
                  </p>
                  <h4 className="text-darkBlack font-semibold text-base md:text-lg lg:text-xl">
                    {totalCustPris ? formatCurrency(totalCustPris) : "kr 0"}
                  </h4>
                </div>
                <div>
                  <p className="text-secondary text-xs md:text-sm mb-1">
                    Din pris med tilvalg
                  </p>
                  <h4 className="text-darkBlack font-semibold text-base md:text-lg lg:text-xl">
                    {formatCurrency(totalPrice)}
                  </h4>

                  <p className="text-secondary text-xs md:text-sm">
                    Inkludert tomtepris (
                    {pris
                      ? pris === 0
                        ? "kr 0"
                        : convertCurrencyFormat(pris)
                      : "kr 0"}
                    )
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center justify-between sm:justify-end">
                <Button
                  text="Tilbake"
                  className="border-2 border-primary text-primary hover:border-[#1E5F5C] hover:text-[#1E5F5C] focus:border-[#003A37] focus:text-[#003A37] sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
                  onClick={() => {
                    handlePrevious();
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                  }}
                />
                <Button
                  text="Neste: Velg tomt"
                  className="border border-primary bg-primary hover:bg-[#1E5F5C] hover:border-[#1E5F5C] focus:bg-[#003A37] focus:border-[#003A37] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                  onClick={() => {
                    handleNext();
                  }}
                />
              </div>
            </div>
          </SideSpaceContainer>
        </div>
      </>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-40 visible" : "opacity-0 invisible"
        }`}
        style={{ zIndex: 999999 }}
        onClick={closeDrawer}
      ></div>
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[80%] lg:w-1/2 bg-white shadow-lg transition-transform duration-700 transform z-[999999] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedDrawerProduct && (
          <div>
            <div className="py-4 md:py-5 px-4 md:px-8 flex items-center justify-between gap-6 border-b border-[#DCDFEA]">
              <h2 className="text-base md:text-lg desktop:text-xl font-semibold text-darkBlack">
                {selectedDrawerProduct?.Produktnavn}
              </h2>
              <button onClick={closeDrawer}>
                <Image src={Ic_close} alt="close" />
              </button>
            </div>
            <div className="py-4 md:py-5 px-4 md:px-8">
              <div className="grid grid-cols-2 gap-4 mb-4 md:mb-6">
                {selectedDrawerProduct?.Hovedbilde?.map(
                  (img: any, index: number) => (
                    <img
                      src={img}
                      alt="image"
                      className="h-[181px] w-full object-cover"
                      key={index}
                    />
                  )
                )}
              </div>
              <textarea
                value={selectedDrawerProduct?.Produktbeskrivelse}
                className="text-base text-secondary h-full focus-within:outline-none resize-none w-full"
                ref={textareaRef}
                readOnly
              ></textarea>
            </div>
          </div>
        )}
      </div>

      {!loginUser && (
        <div
          className="absolute top-0 h-full w-full left-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
          }}
        ></div>
      )}

      {isPopupOpen && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-black bg-opacity-50"
          style={{
            zIndex: 999999,
          }}
        >
          <div
            className="bg-white mx-4 p-4 md:p-8 rounded-[8px] w-full max-w-[787px] relative"
            style={{
              boxShadow:
                "0px 8px 8px -4px rgba(16, 24, 40, 0.031), 0px 20px 24px -4px rgba(16, 24, 40, 0.078)",
            }}
          >
            <button
              className="absolute top-2 md:top-3 right-0 md:right-3"
              onClick={() => {
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
                handlePrevious();
                setIsPopupOpen(false);
              }}
            >
              <Image src={Ic_close} alt="close" />
            </button>
            <div className="flex justify-center w-full mb-[46px]">
              <Image src={Img_vipps_login} alt="vipps login" />
            </div>
            <h2 className="text-black text-[24px] md:text-[32px] desktop:text-[40px] font-extrabold mb-2 text-center">
              Din <span className="text-primary">Min</span>Tomt-profil
            </h2>
            <p className="text-black text-xs md:text-sm desktop:text-base text-center mb-4">
              Logg inn for å få tilgang til alt{" "}
              <span className="font-bold">MinTomt x Fjellheimhytta</span> har å
              by på.
            </p>
            <Formik
              initialValues={{ terms_condition: false }}
              validationSchema={validationLoginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({}) => (
                <Form>
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex justify-end">
                      <VippsButton />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <p className="text-secondary text-sm md:text-base mt-[46px] text-center">
              Når du går videre, aksepterer du <br /> våre vilkår for{" "}
              <a
                className="underline"
                target="__blank"
                href="https://fjellheimhytta.mintomt.no/vilkaar-personvern/brukervilkaar"
              >
                bruk
              </a>{" "}
              og{" "}
              <a
                className="underline"
                target="__blank"
                href="https://fjellheimhytta.mintomt.no/vilkaar-personvern/personvaern"
              >
                personvern
              </a>
            </p>
          </div>
        </div>
      )}

      {loginPopup && !loginUser && (
        <div
          className="fixed top-0 left-0 flex justify-center items-center h-full w-full"
          style={{ zIndex: 9999999 }}
        >
          <LoginForm
            path={`${router.pathname}?${queryString}`}
            setLoginPopup={setLoginPopup}
            setIsCall={setIsCall}
          />
        </div>
      )}
    </div>
  );
};

export default Tilpass;
