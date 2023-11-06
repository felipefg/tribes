"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
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
  const [projects_created, setProjectsCreated] = useState([]);
  const [purchased_courses, setPurchasedCourses] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (account) {
          const response = await axios.get(
            `https://tribes.felipefg.org/inspect/profile/${account}`
          );
          const data = response.data;
          const payload = ethers.toUtf8String(data.reports[0].payload);
          const payloadArray = JSON.parse(payload);
          setProjectsCreated(payloadArray["projects_created"]);
          setPurchasedCourses(payloadArray["courses_bought"]);
          setBids(payloadArray["bids"]);
          console.log(payloadArray);
        }
      } catch (error) {
        console.error("Erro na solicitação da API:", error);
        throw error;
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [account]);

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
                {purchased_courses.map((item, index) => (
                  <CardPurchasedCourse
                    key={index}
                    title={item.name}
                    description={item.description}
                  />
                ))}
              </div>
            )}
            {buttonClicked == "bids-made" && (
              <div>
                {bids.map((item, index) => (
                  <CardBids
                    key={index}
                    bid_date={item.timestamp}
                    rate={item.project.preturn_rate_pct}
                    bid_value={item.volume}
                    date_end_auction={item.project.auction_end_time}
                    auction_status={item.project.state}
                    creator={item.project.creator_address}
                    return_rate_pct={item.return_rate_pct}
                    state={item.state}
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
                  <div className="py-4 grid grid-cols-4 gap-16 relative z-10">
                    {projects_created.map((item, index) => (
                      <CardCreatorsDashboard
                        key={index}
                        title={item.name}
                        description={item.description}
                        rate={item.return_rate_pct}
                        percentage_raised={
                          item.total_financed / item.pledged_value
                        }
                        creator_rate_pct={item.creator_rate_pct}
                        state={item.state}
                        min_viable_value={item.min_viable_value}
                        minimum_bid={item.minimum_bid}
                        auction_end_time={item.auction_end_time}
                      />
                    ))}
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
