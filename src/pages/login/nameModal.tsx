import Button from "@/components/common/button";
import React, { useState } from "react";

const NameModal: React.FC<{ isOpen: any; onClose: any; onSubmit: any }> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    } else {
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray2 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Enter Your Name</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <div className="flex justify-center gap-4 items-center mt-4">
              <Button
                text="Cancel"
                className="border-2 border-primary text-primary sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[28px] relative desktop:py-[16px]"
                onClick={onClose}
              />
              <Button
                text="Submit"
                className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium relative desktop:px-[28px] desktop:py-[16px]"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default NameModal;
