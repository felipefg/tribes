"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import TribesFactory from "@/abis/TribesFactory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PopupProjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); 
  const [creator_rate_pct, setCreatorRatePct] = useState(""); 
  const [affiliate_rate_pct, setCAffiliateRatePct] = useState("");
  const [min_viable_value, setMinViableValue] = useState("");
  const [pledged_value, setPledgedValue] = useState("");
  const [auction_end_time, setAuctionEndTime] = useState("");
  const [minimum_bid, setMinimumBid] = useState("");
  const [presale_start_time, setPresaleStartTime] = useState("");
  const [presale_end_time, setPresaleEndTime] = useState("");
  const [presale_price, setPresalePrice] = useState("");
  const [sale_start_time, setSaleStartTime] = useState("");
  const [sale_end_time, setSaleEndTime] = useState("");
  const [sale_price, setSalePrice] = useState("");
  const [cid, setCid] = useState("");
  const [contract, setContract] = useState("");

  const initializeContract = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const contractAddress = "0x6D2822a3B3c7aF2437Fd7fA2bF83A18381e606F0";
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const connect_contract = new ethers.Contract(
          contractAddress,
          TribesFactory.abi,
          signer
        );
        setContract(connect_contract);
        console.log(contract);
      } else {
        console.error("MetaMask is not installed or not available.");
      }
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  };

  useEffect(() => {
    initializeContract();
  }, []);

  const handleNewProduct = async () => {
    try {

      const selected_auction_end_time = new Date(auction_end_time);
      const auction_end_time_timeStamp = Math.floor(selected_auction_end_time.getTime() / 1000)

      const selected_presale_start_time = new Date(presale_start_time);
      const presale_start_time_timeStamp = Math.floor(selected_presale_start_time.getTime() / 1000)

      const selected_presale_end_time = new Date(presale_end_time);
      const presale_end_time_timeStamp = Math.floor(selected_presale_end_time.getTime() / 1000)

      const selected_sale_start_time = new Date(sale_start_time);
      const sale_start_time_timeStamp = Math.floor(selected_sale_start_time.getTime() / 1000)

      const selected_sale_end_time = new Date(sale_end_time);
      const sale_end_time_timeStamp = Math.floor(selected_sale_end_time.getTime() / 1000)

      const jsonData = {
        name: name, 
        description: description,
        creator_rate_pct: creator_rate_pct,
        affiliate_rate_pct: affiliate_rate_pct,
        min_viable_value: min_viable_value,
        pledged_value: pledged_value,
        auction_end_time: auction_end_time_timeStamp, 
        minimum_bid: minimum_bid,
        presale_start_time: presale_start_time_timeStamp,
        presale_end_time: presale_end_time_timeStamp,
        presale_price: presale_price,
        sale_start_time: sale_start_time_timeStamp,
        sale_end_time: sale_end_time_timeStamp,
        sale_price: sale_price
      
      };

      const utf8Bytes = ethers.toUtf8Bytes(JSON.stringify(jsonData));
      await contract.createTribe(cid, utf8Bytes);

      notify();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const notify = () =>
    toast.success("Project created successfully!", {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="grid grid-cols-2 gap-10">
        <div className="py-4">
          <h1 className="pt-2 font-medium">Name</h1>
          <input
            value={name}
            type='text'
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Description</h1>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl w-full px-4 py-2 focus:outline-none text-sm border"
          ></textarea>
          <h1 className="pt-2 font-medium">Creator rate</h1>
          <input
            value={creator_rate_pct}
            onChange={(e) => setCreatorRatePct(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Affiliate rate</h1>
          <input
            value={affiliate_rate_pct}
            onChange={(e) => setAffiliateRatePct(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Min viable value</h1>
          <input
            value={min_viable_value}
            onChange={(e) => setMinViableValue(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Pledged value</h1>
          <input
            value={pledged_value}
            onChange={(e) => setPledgedValue(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Auction End Time</h1>
          <input
            value={auction_end_time}
            type="date"
            onChange={(e) => setAuctionEndTime(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Minimum bid</h1>
          <input
            value={minimum_bid}
            onChange={(e) => setMinimumBid(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
        </div>
        <div className="py-4">
          <h1 className="pt-2 font-medium">Pre-sale start time</h1>
          <input
            value={presale_start_time}
            type="date"
            onChange={(e) => setPresaleStartTime(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Pre-Sale end time</h1>
          <input
            value={presale_end_time}
            type="date"
            onChange={(e) => setPresaleEndTime(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Pre-Sale price</h1>
          <input
            value={presale_price}
            onChange={(e) => setPresalePrice(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Sale start time</h1>
          <input
            value={sale_start_time}
            type="date"
            onChange={(e) => setSaleStartTime(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Sale end time</h1>
          <input
            value={sale_end_time}
            type="date"
            onChange={(e) => setSaleEndTime(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">Sale price</h1>
          <input
            value={sale_price}
            onChange={(e) => setSalePrice(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
          <h1 className="pt-2 font-medium">CID</h1>
          <input
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"
          />
        </div>
      </div>
      <button
        onClick={handleNewProduct}
        className="w-full h-10 bg-black text-whiteBackground mt-4 rounded-xl hover:scale-[97%] duration-300"
      >
        Create
      </button>
    </div>
  );
}

export default PopupProjectForm;
