"use client";
import { useState } from "react";
import { useMetaMask } from "../../contexts/WalletContext";
import Image from "next/image";
import gradient4 from "@/assets/gradient4.svg";
import closeIcon from "@/assets/closeIcon.svg";
import wallet from "@/assets/wallet.svg";
import Popup from "@/components/Popup";
import CardPurchasedCourse from "@/components/CardPurchasedCourse";
import CardBids from "@/components/CardBids";
import PopupProjectForm from "@/components/PopupProjectForm";
import CardCreatorsDashboard from "@/components/CardCreatorsDashboard";

const Profile = () => {
  const { account } = useMetaMask();
  const [buttonClicked, setButtonClicked] = useState("purchased-courses");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const itemsPurchased = [
    {
      title: "Learn Python on Web3",
      description:
        "Learn how to use your Python to develop decentralized applications on Web 3.0",
      date: "12/12/2023",
    },
  ];

  const itemsBids = [
    {
      bid_date: "12/12/2023",
      rate: "9%",
      bid_value: "2",
      date_end_auction: "12/12/2023",
      auction_status: "Finished",
      creator: "0x00000000000",
    },
  ];

  const itemsDashboard = [
    {
      title: "Learn Python on Web3",
      rate: "9%",
      percentage_raised: "87%",
      description:"Learn how to use your Python to develop decentralized applications on Web 3.0"
    }
  ]

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
              <div>
                {itemsPurchased.map((item, index) => (
                  <CardPurchasedCourse
                    key={index}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            )}
            {buttonClicked == "bids-made" && (
              <div>
                {itemsBids.map((item, index) => (
                  <CardBids
                  bid_date={item.bid_date}
                  rate={item.rate}
                  bid_value={item.bid_value}
                  date_end_auction={item.date_end_auction}
                  auction_status={item.auction_status}
                  creator={item.creator}
                  />
                ))}
              </div>
            )}
            {buttonClicked == "courses-created" && (
              <div>
                <div className="flex justify-end">
                  <button
                    className="bg-black px-5 py-2 rounded-full text-whiteBackground text-sm mt-4 hover:scale-[98%] duration-300 ease-in-out"
                    onClick={() => setIsPopupOpen(true)}
                  >
                    New Project +
                  </button>
                </div>
                <Popup isOpen={isPopupOpen}>
                  <div className="flex justify-between">
                    <h1 className="text-3xl font-medium">Create project</h1>
                    <button
                      onClick={() => setIsPopupOpen(false)}
                      className="hover:scale-95 duration-300"
                    >
                      <Image
                        draggable={false}
                        src={closeIcon}
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                  <PopupProjectForm />
                </Popup>
                <div>
                {itemsDashboard.map((item, index) => (
                  <CardCreatorsDashboard
                    title={item.title}
                    rate={item.rate}
                    percentage_raised={item.percentage_raised}
                    description={item.description}
                  />
                ))}
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
