"use client";
import { useEffect, useState } from "react";
import { useAuctionContext } from "@/contexts/AuctionContext";
import { useRouter } from "next/navigation";
import gradient4 from "@/assets/gradient4.svg";
import gradient6 from "@/assets/gradient6.svg";
import Image from "next/image";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EtherPortal from "@/abis/EtherPortal"

const AuctionDetails = () => {
  const { selectedAuction } = useAuctionContext();

  const [returnRate, setReturnRate] = useState("");
  const [value, setValue] = useState("");
  const [contract, setContract] = useState("");
  const router = useRouter();

  const initializeContract = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const contractAddress = "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044";
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();

        const connect_contract = new ethers.Contract(
          contractAddress,
          EtherPortal.abi,
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

  const handleBid = async () => {
    try {
      const jsonData = {
        op: "place_bid",
        project_id: selectedAuction?.project_id, //mudar
        return_rate_pct: returnRate,
      }
      const utf8Bytes = ethers.toUtf8Bytes(JSON.stringify(jsonData));
      const final_value = ethers.parseEther(String(value))

      await contract.depositEther('0x828fB8f03fdd6F1146fd4b9e7bc22235cc42a6fc', utf8Bytes, {value: final_value} );
      notify();
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };


  useEffect(() => {
    if (selectedAuction == null) {
      console.log("teste");
      router.push("/launchpad");
    }
    initializeContract();
  }, [selectedAuction]);

  const notify = () => toast.success('Bid successfully placed!', {
    position: "bottom-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
    });;

  return (
    <div className="w-full">
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
      <div className="relative">
        <Image
          draggable={false}
          src={gradient4}
          width={300}
          className="absolute left-0 -top-28 z-0"
        />
      </div>
      <div className="flex justify-between px-20 py-4 z-10 relative">
        <div className="w-1/2">
          <div className="relative z-10 pt-16">
            <h1 className="text-4xl font-medium">{selectedAuction?.name}</h1>
            <p className="font-medium pt-2 text-lg">
              Created by {selectedAuction?.creator_address}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-12 py-4">
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">10 %</h1>
              <p className="text-sm text-center">Maximum rate of return</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">{selectedAuction?.minimum_bid / 1e18}</h1>
              <p className="text-sm text-center">minimum bid amount</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-3xl font-medium">{selectedAuction?.min_viable_value  / 1e18}</h1>
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
              <h1 className="text-2xl font-medium">{selectedAuction?.state}</h1>
              <p className="text-sm text-center">Auction status</p>
            </div>
            <div className="flex flex-col justify-center items-center w-36">
              <h1 className="text-2xl font-medium">10/23/2023</h1>
              <p className="text-sm text-center">End of auction</p>
            </div>
          </div>
          <p className="py-8">
            {selectedAuction?.description}
          </p>
        </div>
        <div className="border w-4/12 rounded-tl-xl rounded-tr-[56px] rounded-bl-[56px] rounded-br-xl py-24 mt-12 mr-16 relative">
          <Image
            draggable={false}
            src={gradient6}
            className="absolute -top-16 left-16 z-0"
          />
          <div className="relative z-10 px-12">
            <h1 className="text-3xl font-medium">New bid</h1>
            <div className="pt-12">
              <p>Return rate</p>
              <input
                onChange={(e) => setReturnRate(e.target.value)}
                className="rounded-full border w-full h-7 px-4 focus:outline-none text-sm"
              />
            </div>
            <div className="pt-6">
              <p>Value</p>
              <input
                onChange={(e) => setValue(e.target.value)}
                className="rounded-full border w-full h-7 px-4 focus:outline-none text-sm"
              />
            </div>
            <button
              onClick={handleBid}
              className="w-full bg-black mt-16 rounded-full text-whiteBackground h-8 hover:scale-[97%] duration-300 ease-in-out"
            >
              Place a bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuctionDetails;
