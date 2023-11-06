"use client";

function formatDate(timestamp) {
  const formatedDate = new Date(timestamp * 1000);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return formatedDate.toLocaleString("en-US", options);
}

export function CardBids(props) {
  
  const bidDate = formatDate(props.bid_date);
  const endAuction = formatDate(props.date_end_auction);

  return (
    <div className="py-4 grid grid-cols-4 gap-16">
      <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl pt-4 pb-8 px-4">
        <p className="text-xs">{bidDate}</p>
        <div className="grid grid-cols-2 grid-8 py-6 justify-center items-center">
          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-2xl font-medium">{props.return_rate_pct} %</h1>
            <p className="text-sm">Return rate</p>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-2xl font-medium">{props.bid_value / 1e18} ETH</h1>
            <p className="text-sm">Bid value</p>
          </div>

          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-xl font-medium">{endAuction}</h1>
            <p className="text-sm">End of auction</p>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <h1 className="text-xl font-medium">{(props.auction_status).toUpperCase()}</h1>
            <p className="text-sm">Auction status</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-medium">{props.creator.substring(0, 6) + "..." + props.creator.substring(37, 42)}</h1>
          <p className="text-sm">Auction creator</p>
        </div>
        <div className="flex justify-center items-center w-full py-1 mt-4 bg-purple rounded-lg font-medium">
          {(props.state).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default CardBids;
