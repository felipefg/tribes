"use client";
import { useState } from "react";
import Image from "next/image";
import gradient4 from "@/assets/gradient4.svg";
import magnifier from "@/assets/magnifier.svg";
import { CardAuction } from "@/components/CardAuction";

const Launchpad = () => {
  const [filter, setFilter] = useState("");

  const itens = [
    {
      title: "Learn Python on Web3",
      description:
        "Learn how to use your Python to develop decentralized applications on Web 3.0",
    },
    {
      title: "Front-end for Web3",
      description:
        "Learn with Web-Manu all tricks to build the right front end for Web 3.0 applications.",
    },
    {
      title: "Intro to Cartesi Gaming",
      description:
        "Learn how to develop and deploy your web game using Cartesi gaming infrastructure",
    },
    {
      title: "Learn Go on Web 3.0",
      description:
        "Learn how to use Go, one of the most popular programming languages, on Web 3.0",
    },
  ];

  const filteredItems = itens.filter((item) =>
    item.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          src={gradient4}
          width={300}
          className="absolute left-0 -top-28 z-0"
        />
        <div className="relative z-10 pt-16 px-20">
          <h1 className="text-4xl font-medium">Creator's launchpad</h1>
          <p className="font-medium pt-2 text-lg">
            Explore the open projects to receive found on different areas and
            funding stage. Place a bid to support the project or just guarantee
            your spot over a pre-sale event
          </p>
        </div>
      </div>
      <div className="mt-12">
        <div className="relative px-20 flex justify-between">
          <h1 className="text-3xl font-medium">Fundraising</h1>
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
        <div className="px-20 py-8 grid grid-cols-4 gap-16">
          {filteredItems.map((item, index) => (
            < CardAuction 
              key={index}
              title={item.title}
              description={item.description}
              />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Launchpad;
