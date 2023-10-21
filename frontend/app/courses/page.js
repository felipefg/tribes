"use client";
import { useState } from "react";
import Image from "next/image";
import gradient5 from "@/assets/gradient5.svg";
import magnifier from "@/assets/magnifier.svg";

const Courses = () => {
  const [filter, setFilter] = useState("");
  const [buttonClicked, setButtonClicked] = useState('pre-sale');

  const itens = [
    { 
      title: "Learn Python on Web3",
      description:
        "Learn how to use your Python to develop decentralized applications on Web 3.0",
      status: "Normal-sale"
    },
    {
      title: "Front-end for Web3",
      description:
        "Learn with Web-Manu all tricks to build the right front end for Web 3.0 applications.",
        status: "Pre-sale"
    },
    {
      title: "Intro to Cartesi Gaming",
      description:
        "Learn how to develop and deploy your web game using Cartesi gaming infrastructure",
        status: "Pre-sale"
    },
    {
      title: "Learn Go on Web 3.0",
      description:
        "Learn how to use Go, one of the most popular programming languages, on Web 3.0",
        status: "Pre-sale"
    },
  ];

  const filteredItems = itens
    .filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
    .filter((item) => item.status.toLowerCase() === buttonClicked)

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          src={gradient5}
          width={400}
          className="absolute right-0 -top-28 z-0"
        />
        <div className="mt-12 z-10 relative pt-16">
          <div className="relative px-20 flex justify-between">
            <h1 className="text-4xl font-medium">Available courses</h1>
            <div className="flex gap-3">
              <input
                type="text"
                className="rounded-full w-64 h-8 px-4 focus:outline-none text-sm"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Image src={magnifier} />
            </div>
          </div>
          <div className="flex px-20 pt-4 gap-2">
            <button className={`px-4 py-1 rounded-full ${buttonClicked == 'normal-sale' ? 'bg-black text-whiteBackground' : 'border text-black '}`} onClick={() => setButtonClicked("normal-sale")}>Normal-sale</button>
            <button className={`px-4 py-1 rounded-full ${buttonClicked == 'pre-sale' ? 'bg-black text-whiteBackground' : 'border text-black bg-whiteBackground'}`}  onClick={() => setButtonClicked("pre-sale")}>Pre-sale</button>
          </div>
          <div className="px-20 py-8 grid grid-cols-3 gap-16">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2"
              >
                <p className="px-4 text-sm">{item.status}</p>
                <h1 className="font-semibold text-xl pb-6 px-4">
                  {item.title}
                </h1>
                <p className="text-sm py-2 px-4">{item.description}</p>
                <div className="flex justify-center mt-4">
                  <button className="bg-black px-16 py-1 rounded-full text-whiteBackground text-sm">
                    See more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Courses;
