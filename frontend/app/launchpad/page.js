"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Image from "next/image";
import gradient4 from "@/assets/gradient4.svg";
import magnifier from "@/assets/magnifier.svg";
import { CardAuction } from "@/components/CardAuction";

const Launchpad = () => {
  const [filter, setFilter] = useState("");
  const [responseApi, setResponseApi] = useState([])


  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get("https://tribes.felipefg.org/inspect/project"); 
        const data = response.data;
        const payload = ethers.toUtf8String(data.reports[0].payload)
        const payloadArray = JSON.parse(payload);
        setResponseApi(payloadArray)
        console.log(payloadArray)

        return data;
      } catch (error) {
        console.error("Erro na solicitação da API:", error);
        throw error;
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          draggable={false}
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
            <Image draggable={false} src={magnifier} />
          </div>
        </div>
        <div className="px-20 py-8 grid grid-cols-4 gap-16">
          {responseApi.map((item, index) => (
            < CardAuction 
              key={index}
              project_id={item.project_id}
              name={item.name}
              description={item.description}
              creator_address={item.creator_address}
              minimum_bid={item.minimum_bid}
              min_viable_value={item.min_viable_value}
              state={item.state}
              auction_end_time={item.auction_end_time}
              max_return_rate_pct={item.max_return_rate_pct}
              total_financed={item.total_financed}
              pledged_value={item.pledged_value}
              tribe_address={item.tribe_address}
              />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Launchpad;
