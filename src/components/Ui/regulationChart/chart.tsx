import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const getRandomColor = (index: number) => {
  const baseHue = 24;
  const saturation = 80 + ((index * 3) % 10);
  const lightness = 45 + ((index * 5) % 10);
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

const EierinformasjonChart: React.FC<{ chartData: any }> = ({ chartData }) => {
  const data = chartData?.map((item: any) => ({
    name: item.Navn,
    value: parseFloat(item.value),
  }));

  return (
    <>
      <div className="w-full h-[270px] md:h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((_entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-grayText text-base mb-2">Eierandel</span>
          <span className="text-black font-semibold text-[26px]">100%</span>
        </div>
      </div>
      <div className="mt-6 md:mt-[48px] md:mb-3">
        <div className="flex justify-between gap-4">
          {data?.map((item: any, index: any) => (
            <div key={index} className="flex items-start gap-2">
              <div className="h-[26px] w-3 flex items-center">
                <div
                  className="w-full h-3 rounded-full"
                  style={{ backgroundColor: getRandomColor(index) }}
                ></div>
              </div>
              <div>
                <div className="font-semibold text-lg md:text-[20px] h-[26px]">
                  {item.value}%
                </div>
                <span className="text-sm font-medium text-darkBlack">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EierinformasjonChart;
