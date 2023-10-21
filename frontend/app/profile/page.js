"use client";
import { useState } from "react";
import { useMetaMask } from "../../contexts/WalletContext";
import Image from "next/image";
import gradient4 from "@/assets/gradient4.svg";
import closeIcon from "@/assets/closeIcon.svg"
import wallet from "@/assets/wallet.svg";
import Popup from "@/components/Popup";

const Profile = () => {
  const { account } = useMetaMask();
  const [buttonClicked, setButtonClicked] = useState("purchased-courses");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          src={gradient4}
          width={300}
          className="absolute left-0 -top-28 z-0"
        />
        <div className="relative z-10 pt-16 px-20">
          <h1 className="text-4xl font-medium">Profile</h1>
          <div className="flex gap-2 pt-1">
            <Image src={wallet} />
            <p className="font-medium pt-2 text-lg">
              {account ? account : "Your wallet"}
            </p>
          </div>
        </div>
        <div className="divide-y divide-purple px-20 relative z-10">
          <div className="flex gap-20 z-10 relative pt-12 pb-6">
            <button
              className={`rounded-lg px-2 ${
                buttonClicked === "purchased-courses" ? "bg-purple" : ""
              }`}
              onClick={() => setButtonClicked("purchased-courses")}
            >
              Purchased courses
            </button>
            <button
              className={`rounded-lg px-2 ${
                buttonClicked === "bids-made" ? "bg-purple" : ""
              }`}
              onClick={() => setButtonClicked("bids-made")}
            >
              My bids
            </button>
            <button
              className={`rounded-lg px-2 ${
                buttonClicked === "courses-created" ? "bg-purple" : ""
              }`}
              onClick={() => setButtonClicked("courses-created")}
            >
              Creator's dashboard
            </button>
          </div>
          <div>
            {buttonClicked == "purchased-courses" && (
              <div className="py-8 grid grid-cols-4 gap-16">
                <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2">
                  <h1 className="font-semibold text-xl pb-6 px-4">
                    Learn Python on Web3
                  </h1>
                  <p className="text-sm py-2 px-4">
                    Learn how to use your Python to develop decentralized
                    applications on Web 3.0. Learn how to master your python
                    skills and apply it to breate decentralized apps
                  </p>
                  <p className="text-sm py-4 px-4">12/12/2023</p>
                </div>
              </div>
            )}
            {buttonClicked == "bids-made" && (
              <div className="py-4 grid grid-cols-4 gap-16">
                <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl pt-4 pb-8 px-4">
                  <p className="text-xs">12/12/2023</p>
                  <div className="grid grid-cols-2 grid-8 py-6 justify-center items-center">
                    <div className="flex flex-col justify-center items-center py-2">
                      <h1 className="text-2xl font-medium">9%</h1>
                      <p className="text-sm">Return rate</p>
                    </div>
                    <div className="flex flex-col justify-center items-center py-2">
                      <h1 className="text-2xl font-medium">1 ETH</h1>
                      <p className="text-sm">Bid value</p>
                    </div>

                    <div className="flex flex-col justify-center items-center py-2">
                      <h1 className="text-xl font-medium">12/12/2022</h1>
                      <p className="text-sm">End of auction</p>
                    </div>
                    <div className="flex flex-col justify-center items-center py-2">
                      <h1 className="text-xl font-medium">Finished</h1>
                      <p className="text-sm">Auction status</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-xl font-medium">0x000000000000000</h1>
                    <p className="text-sm">Auction creator</p>
                  </div>
                  <div className="flex justify-center items-center w-full py-1 mt-4 bg-purple rounded-lg">
                    Bid Accepted
                  </div>
                </div>
              </div>
            )}
            {buttonClicked == "courses-created" && (
              <div>
                <div className="flex justify-end">
                <button className="bg-black px-5 py-2 rounded-full text-whiteBackground text-sm mt-4 hover:scale-[98%] duration-300 ease-in-out" onClick={() => setIsPopupOpen(true)}>New Project +</button>
                </div>
                <Popup isOpen={isPopupOpen} >
                  <div className="flex justify-between"> 
                    <h1 className="text-3xl font-medium">Create product</h1>  
                    <button onClick={() => setIsPopupOpen(false)} className="hover:scale-95 duration-300">
                      <Image src={closeIcon} width={15} height={15}/>
                    </button>
                  </div>
                  <p>oiii!!!</p>
                </Popup>
                <div className="py-4 grid grid-cols-4 gap-16 relative z-10">
                  <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2">
                    <h1 className="font-semibold text-xl pb-6 px-4">
                      Learn Python on Web3
                    </h1>
                    <div className="grid grid-cols-2 gap-4 py-2 justify-center items-start px-4">
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">9%</h1>
                        <p className="text-sm text-center">Maximum rate of return</p>
                      </div>
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">87%</h1>
                        <p className="text-sm text-center">Percentage raised</p>
                      </div>
                    </div>
                    <h1 className="text-sm font-medium pt-2 pl-4">Description:</h1>
                    <p className="text-sm p-1 pl-4">
                      Learn how to use your Python to develop decentralized
                      applications on Web 3.0. Learn how to master your python
                      skills and apply it to breate decentralized apps
                    </p>
                  </div>
                  <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2">
                    <h1 className="font-semibold text-xl pb-6 px-4">
                      Learn Python on Web3
                    </h1>
                    <div className="grid grid-cols-2 gap-4 py-2 justify-center items-start px-4">
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">9%</h1>
                        <p className="text-sm text-center">Maximum rate of return</p>
                      </div>
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">87%</h1>
                        <p className="text-sm text-center">Percentage raised</p>
                      </div>
                    </div>
                    <h1 className="text-sm font-medium pt-2 pl-4">Description:</h1>
                    <p className="text-sm p-1 pl-4">
                      Learn how to use your Python to develop decentralized
                      applications on Web 3.0. Learn how to master your python
                      skills and apply it to breate decentralized apps
                    </p>
                  </div>
                  <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2">
                    <h1 className="font-semibold text-xl pb-6 px-4">
                      Learn Python on Web3
                    </h1>
                    <div className="grid grid-cols-2 gap-4 py-2 justify-center items-start px-4">
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">9%</h1>
                        <p className="text-sm text-center">Maximum rate of return</p>
                      </div>
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">87%</h1>
                        <p className="text-sm text-center">Percentage raised</p>
                      </div>
                    </div>
                    <h1 className="text-sm font-medium pt-2 pl-4">Description:</h1>
                    <p className="text-sm p-1 pl-4">
                      Learn how to use your Python to develop decentralized
                      applications on Web 3.0. Learn how to master your python
                      skills and apply it to breate decentralized apps
                    </p>
                  </div>
                  <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2">
                    <h1 className="font-semibold text-xl pb-6 px-4">
                      Learn Python on Web3
                    </h1>
                    <div className="grid grid-cols-2 gap-4 py-2 justify-center items-start px-4">
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">9%</h1>
                        <p className="text-sm text-center">Maximum rate of return</p>
                      </div>
                      <div className="flex flex-col justify-center items-center py-2 w-32">
                        <h1 className="text-2xl font-medium">87%</h1>
                        <p className="text-sm text-center">Percentage raised</p>
                      </div>
                    </div>
                    <h1 className="text-sm font-medium pt-2 pl-4">Description:</h1>
                    <p className="text-sm p-1 pl-4">
                      Learn how to use your Python to develop decentralized
                      applications on Web 3.0. Learn how to master your python
                      skills and apply it to breate decentralized apps
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;


