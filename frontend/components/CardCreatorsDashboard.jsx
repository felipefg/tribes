"use client";
import { useState } from "react";
import Popup from "@/components/Popup";
import closeIcon from "@/assets/closeIcon.svg";
import Image from "next/image";

export function CardCreatorsDashboard(props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rate, setRate] = useState("");
  const [title, setTitle] = useState("");
  const [percentageRaised, setPercentageRaised] = useState("");
  const [viableValue, setViableValue] = useState("");
  const [minimumBid, setMinimumBid] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [date, setDate] = useState("");

  const handleClick = async (
    title,
    creator_rate_pct,
    percentage_raised,
    minimum_bid,
    min_viable_value,
    description,
    state,
    auction_end_time
  ) => {
    setIsPopupOpen(true);

    setRate(creator_rate_pct);
    setTitle(title);
    setPercentageRaised(percentage_raised);
    setViableValue(min_viable_value);
    setMinimumBid(minimum_bid);
    setDescription(description);
    setState(state);

    const formatedDate = new Date(auction_end_time * 1000);
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    setDate(formatedDate.toLocaleString("en-US", options));
  };

  return (
    <div>
      <button
        onClick={() =>
          handleClick(
            props.title,
            props.creator_rate_pct,
            props.percentage_raised,
            props.minimum_bid,
            props.min_viable_value,
            props.description,
            props.state,
            props.auction_end_time
          )
        }
        className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-4"
      >
        <h1 className="font-semibold text-xl pb-6 px-4">{props.title}</h1>
        <div className="grid grid-cols-2 gap-4 py-2 justify-center items-start px-4">
          <div className="flex flex-col justify-center items-center py-2 w-32">
            <h1 className="text-2xl font-medium">{props.creator_rate_pct} %</h1>
            <p className="text-sm text-center">Maximum rate of return</p>
          </div>
          <div className="flex flex-col justify-center items-center py-2 w-32">
            <h1 className="text-2xl font-medium">
              {props.percentage_raised} %
            </h1>
            <p className="text-sm text-center">Percentage raised</p>
          </div>
        </div>
        <div className="flex justify-center items-center w-full py-1 mt-4 bg-purple rounded-lg font-medium">
          {props.state.toUpperCase()}
        </div>
      </button>

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
            <h1 className="text-4xl font-medium">{title}</h1>
          </div>
          <div className="grid grid-cols-3 gap-12 py-4">
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">{rate} %</h1>
              <p className="text-sm text-center">Maximum rate of return</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">{minimumBid / 1e18} ETH </h1>
              <p className="text-sm text-center">minimum bid amount</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">{viableValue / 1e18} ETH</h1>
              <p className="text-sm text-center">
                minimum required to start project
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-12 py-4">
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">{percentageRaised} %</h1>
              <p className="text-sm text-center">Percentage raised</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-2xl font-medium">{state.toUpperCase()}</h1>
              <p className="text-sm text-center">Auction status</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-2xl font-medium">{date}</h1>
              <p className="text-sm text-center">End of auction</p>
            </div>
          </div>
          <p className="py-8">{description}</p>
        </div>
      </Popup>
    </div>
  );
}

export default CardCreatorsDashboard;
