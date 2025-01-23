import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Ic_search_location from "@/public/images/Ic_search_location.svg";
import Link from "next/link";
import ApiUtils from "@/api";
import { useAddress } from "@/context/addressContext";

const TomtTab = () => {
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [isKartFocused, setIsKartFocused] = useState(false);
  const [addressInputValue, setAddressInputValue] = useState("");
  const [kartInputValue, setKartInputValue] = useState("");
  const { setStoreAddress } = useAddress();
  const [hasMounted, setHasMounted] = useState(false);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const kartInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [KartData, setKartData] = useState<any>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAddressInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setAddressInputValue(value);

    if (value) {
      try {
        const response = await ApiUtils.getAddress(value);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setAddressData(json.adresser);
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  const handleKartInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setKartInputValue(value);

    if (value) {
      try {
        const response = await ApiUtils.getAddress(value);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setKartData(json.adresser);
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  const handleClearAddressInput = () => {
    setAddressInputValue("");
    setIsAddressFocused(false);
  };

  const handleClearKartInput = () => {
    setKartInputValue("");
    setIsKartFocused(false);
  };

  const handleAddressFocus = () => {
    setIsAddressFocused(true);
  };

  const handleKartFocus = () => {
    setIsKartFocused(true);
  };

  const handleAddressBlur = () => {
    if (addressInputValue === "") {
      setIsAddressFocused(false);
    }
  };

  const handleKartBlur = () => {
    if (kartInputValue === "") {
      setIsKartFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsAddressFocused(false);
        setIsKartFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!hasMounted) return null;

  return (
    <>
      <div
        className={`shadow-shadow1 border-gray border rounded-[112px] flex items-center relative justify-between p-3 ${
          isAddressFocused || isKartFocused ? "bg-lightGreen" : "bg-[#fff]"
        }`}
        ref={containerRef}
      >
        <div className="flex items-center justify-between w-10/12">
          <div
            className={`w-full rounded-[88px] py-2 px-9 items-center flex justify-between ${isAddressFocused ? "bg-white" : "bg-transparent"} relative`}
            style={{
              boxShadow: isAddressFocused
                ? "0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.1)"
                : "",
            }}
            onClick={() => addressInputRef.current?.focus()}
          >
            <div>
              <div className="text-black mb-2 text-base">Adresse</div>
              <input
                ref={addressInputRef}
                type="text"
                className="focus:border-0 focus-within:border-0 focus:outline-none text-black text-xl font-medium bg-transparent"
                placeholder="Søk på adresse"
                onFocus={handleAddressFocus}
                onBlur={handleAddressBlur}
                onChange={handleAddressInputChange}
                value={addressInputValue}
              />
            </div>
            {isAddressFocused && (
              <Image
                src={Ic_close}
                alt="close"
                className="cursor-pointer"
                onClick={handleClearAddressInput}
              />
            )}
          </div>

          <div className="h-[60px] w-[1px] bg-[#EAECF0] mx-8"></div>

          <div
            className={`w-full rounded-[88px] py-2 px-9 items-center flex justify-between ${isKartFocused ? "bg-white" : "bg-transparent"} relative`}
            style={{
              boxShadow: isKartFocused
                ? "0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.1)"
                : "",
            }}
            onClick={() => kartInputRef.current?.focus()}
          >
            <div>
              <div className="text-black mb-2 text-base">Kart</div>
              <input
                ref={kartInputRef}
                type="text"
                className="focus:border-0 focus-within:border-0 focus:outline-none text-black text-xl font-medium bg-transparent"
                placeholder="Søk i kart"
                onFocus={handleKartFocus}
                onBlur={handleKartBlur}
                onChange={handleKartInputChange}
                value={kartInputValue}
              />
            </div>
            {isKartFocused && (
              <Image
                src={Ic_close}
                alt="close"
                className="cursor-pointer"
                onClick={handleClearKartInput}
              />
            )}
          </div>
        </div>
        {addressData && addressData.length > 0 && (
          <div
            className="absolute top-[108px] left-0 bg-white rounded-[8px] py-[12px] px-[16px] w-full h-[400px] overflow-auto"
            style={{
              zIndex: 99999,
              boxShadow:
                "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
            }}
          >
            {addressData &&
              addressData.map((address: any, index: number) => (
                <Link
                  href={`/regulations?kommunenummer=${address.kommunenummer}&gardsnummer=${address.gardsnummer}&bruksnummer=${address.bruksnummer}&kommunenavn=${address.kommunenavn}`}
                  className="p-3 flex items-center gap-4 hover:bg-lightGreen"
                  key={index}
                  onClick={() => {
                    localStorage.setItem(
                      "IPlot_Address",
                      JSON.stringify(address)
                    );
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                    setStoreAddress(address);
                  }}
                >
                  <Image src={Ic_search_location} alt="location" />
                  <div>
                    <span className="text-secondary text-base font-medium">
                      Adresse:
                    </span>{" "}
                    <span className="text-black font-medium text-lg">
                      {`${address.adressetekst}  ${address.postnummer} ${address.poststed}` ||
                        "N/A"}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        )}
        {KartData && KartData.length > 0 && (
          <div
            className="absolute top-[108px] left-0 bg-white rounded-[8px] py-[12px] px-[16px] w-full h-[400px] overflow-auto"
            style={{
              zIndex: 99999,
              boxShadow:
                "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
            }}
          >
            {KartData &&
              KartData.map((kart: any, index: number) => (
                <Link
                  href={`/regulations?kommunenummer=${kart.kommunenummer}&gardsnummer=${kart.gardsnummer}&bruksnummer=${kart.bruksnummer}&kommunenavn=${kart.kommunenavn}`}
                  className="p-3 flex items-center gap-4 hover:bg-lightGreen"
                  key={index}
                  onClick={() => {
                    localStorage.setItem("IPlot_Address", JSON.stringify(kart));
                    setStoreAddress(kart);
                    const currIndex = 0;
                    localStorage.setItem("currIndex", currIndex.toString());
                  }}
                >
                  <Image src={Ic_search_location} alt="location" />
                  <div>
                    <span className="text-secondary text-base font-medium">
                      Kommune:
                    </span>{" "}
                    <span className="text-black font-medium text-lg">
                      {`${kart.adressetekst}  ${kart.postnummer} ${kart.poststed}` ||
                        "N/A"}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        )}
        <div
          className={`p-[22px] cursor-pointer flex justify-center items-center bg-primary rounded-full gap-[10px] transition-all duration-300 ease-out ${
            isAddressFocused || isKartFocused ? "w-[180px]" : "w-[76px]"
          }`}
        >
          <Image src={Ic_search} alt="search" />
          {(isAddressFocused || isKartFocused) && (
            <span className={`text-white font-medium text-xl slide-in-text`}>
              Search
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slide-in-text {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default TomtTab;
