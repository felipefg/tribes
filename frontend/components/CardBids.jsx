"use client";

export function CardBids(props) {
  return (
    <div className="py-4 grid grid-cols-4 gap-16">
      <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl pt-4 pb-8 px-4">
        <p className="text-xs">{props.bid_date}</p>
        <div className="grid grid-cols-2 grid-8 py-6 justify-center items-center">
          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-2xl font-medium">{props.rate}</h1>
            <p className="text-sm">Return rate</p>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-2xl font-medium">{props.bid_value} ETH</h1>
            <p className="text-sm">Bid value</p>
          </div>

          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-xl font-medium">{props.date_end_auction}</h1>
            <p className="text-sm">End of auction</p>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-xl font-medium">{props.auction_status}</h1>
            <p className="text-sm">Auction status</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-medium">{props.creator}</h1>
          <p className="text-sm">Auction creator</p>
        </div>
        <div className="flex justify-center items-center w-full py-1 mt-4 bg-purple rounded-lg">
          Bid Accepted
        </div>
      </div>
    </div>
  );
}

export default CardBids;
