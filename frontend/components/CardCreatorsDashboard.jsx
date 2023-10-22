"use client";
import { useState } from "react";
import Popup from "@/components/Popup";
import closeIcon from "@/assets/closeIcon.svg";
import Image from "next/image";

export function CardCreatorsDashboard(props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  return (
    <div className="py-4 grid grid-cols-4 gap-16 relative z-10">
      <Popup isOpen={isPopupOpen}>
        <div className="flex justify-end">
          <button
            onClick={() => setIsPopupOpen(false)}
            className="hover:scale-95 duration-300"
          >
            <Image draggable={false} src={closeIcon} width={15} height={15} />
          </button>
        </div>
        <div className="">
          <div className="relative z-10 py-4">
            <h1 className="text-4xl font-medium">Learn Python on Web3</h1>
          </div>
          <div className="grid grid-cols-3 gap-12 py-4">
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">10 %</h1>
              <p className="text-sm text-center">Maximum rate of return</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">1 ETH </h1>
              <p className="text-sm text-center">minimum bid amount</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">15 ETH</h1>
              <p className="text-sm text-center">
                minimum required to start project
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-12 py-4">
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">87%</h1>
              <p className="text-sm text-center">Percentage raised</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-2xl font-medium">Finished</h1>
              <p className="text-sm text-center">Auction status</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-2xl font-medium">11/11/2023</h1>
              <p className="text-sm text-center">End of auction</p>
            </div>
          </div>
          <p className="py-8">
            Learn how to use your Python to develop decentralized applications
            on Web 3.0. Learn how to master your python skills and apply it to
            breate decentralized apps. Course and classes with Msc Felipe an AI
            specialist and seasoned developer using python for AI DApps in Web
            3.0 .
          </p>
        </div>
      </Popup>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2"
      >
        <h1 className="font-semibold text-xl pb-6 px-4">{props.title}</h1>
        <div className="grid grid-cols-2 gap-4 py-2 justify-center items-start px-4">
          <div className="flex flex-col justify-center items-center py-2 w-32">
            <h1 className="text-2xl font-medium">{props.rate}</h1>
            <p className="text-sm text-center">Maximum rate of return</p>
          </div>
          <div className="flex flex-col justify-center items-center py-2 w-32">
            <h1 className="text-2xl font-medium">{props.percentage_raised}</h1>
            <p className="text-sm text-center">Percentage raised</p>
          </div>
        </div>
        <h1 className="text-sm font-medium pt-2 pl-4">Description:</h1>
        <p className="text-sm p-1 pl-4">{props.description}</p>
        <div className="flex justify-center items-center w-full py-1 mt-4 bg-purple rounded-lg">
          Finished
        </div>
      </button>
    </div>
  );
}

export default CardCreatorsDashboard;
