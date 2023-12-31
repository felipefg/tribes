"use client";
import { useAuctionContext } from "@/contexts/AuctionContext";
import { useRouter } from "next/navigation";

export function CardAuction(props) {

  const { selectAuction } = useAuctionContext();
  const router = useRouter();

  const handleCardClick = () =>  {
    selectAuction({
      name: props.name,
      description: props.description,
      key: props.key,
      creator_address: props.creator_address,
      minimum_bid: props.minimum_bid,
      min_viable_value: props.min_viable_value,
      state: props.state,
      auction_end_time: props.auction_end_time,
      max_return_rate_pct: props.max_return_rate_pct,
      total_financed: props.total_financed,
      pledged_value: props.pledged_value,
      tribe_address: props.tribe_address
    });

    router.push("/auction-details");
  }

  return (
    <div
      key={props.key}
      className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2"
    >
      <h1 className="font-semibold text-xl pb-6 px-4">{props.name}</h1>
      <p className="text-sm py-2 px-4">{props.description}</p>
      <div className="flex justify-center mt-4">
        <button 
        onClick={handleCardClick}
        className="bg-black px-16 py-1 rounded-full text-whiteBackground text-sm">
          See more
        </button>
      </div>
    </div>
  );
}

export default CardAuction;
