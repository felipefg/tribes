import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Tribe from "@/abis/Tribe"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PopupBuyCourse(props) {
    const [affiliate, setAffiliate] = useState("not-affiliate");
    const [affiliateAddress, setAffiliateAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [contract, setContract] = useState("");

    const initializeContract = async () => {
        try {
          if (typeof window.ethereum !== "undefined") {
            const contractAddress = "0x408253c8143f916be48913c462206fa69248fce0";
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner();
    
            const connect_contract = new ethers.Contract(
              contractAddress,
              Tribe.abi,
              signer
            );
            setContract(connect_contract);
          } else {
            console.error("MetaMask is not installed or not available.");
          }
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      };
    
      const handleBuyCourseWhithAffiliated = async () => {
        try {
        
          await contract.mintWithAffiliate(amount, affiliateAddress);
          notify();
        } catch (error) {
          console.error("Error:", error);
        }
      };

      const handleBuyCourse = async () => {
        try {
        
          await contract.mint(amount);
          notify();
        } catch (error) {
          console.error("Error:", error);
        }
      };
    
      useEffect(() => {
        initializeContract();
      }, []);

      const notify = () => toast.success('Successfully purchased', {
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
        <div className="grid grid-cols-2 gap-10 py-4">
            <button
            className={`px-4 py-1 rounded-full ${
                affiliate == "not-affiliate"
                ? "bg-black text-whiteBackground"
                : "border text-black "
            }`}
            onClick={() => setAffiliate("not-affiliate")}
            >
            Buy
            </button>
            <button
            className={`px-4 py-1 rounded-full ${
                affiliate == "affiliate"
                ? "bg-black text-whiteBackground"
                : "border text-black bg-whiteBackground"
            }`}
            onClick={() => setAffiliate("affiliate")}
            >
            Buy with Affiliate
            </button>
        </div>
        {affiliate == "affiliate" && (
            <div>
            <p className="text-sm">{props.status}</p>
            <h1 className="text-xl font-medium mt-1">{props.title}</h1>
            <p>{props.description}</p>

            <h1 className="text-lg font-medium mt-8">
                Amount
            </h1>
            <input 
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border" />

            <h1 className="text-lg font-medium mt-8">
                Fill the affiliate address
            </h1>
            <input 
            onChange={(e) => setAffiliateAddress(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border" />

            <button 
            onClick={handleBuyCourseWhithAffiliated}
            className="bg-black w-full mt-6 h-8 rounded-xl text-whiteBackground hover:scale-[97%] duration-300 ease-in-out]">
                Buy
            </button>
            </div>
        )}
        {affiliate == "not-affiliate" && (
            <div>
            <p className="text-sm">{props.status}</p>
            <h1 className="text-xl font-medium mt-1">{props.title}</h1>
            <p>{props.description}</p>
            <h1 className="text-lg font-medium mt-8">
                Amount
            </h1>
            <input
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border" />

            <button
                onClick={handleBuyCourse}
             className="bg-black w-full mt-6 h-8 rounded-xl text-whiteBackground hover:scale-[97%] duration-300 ease-in-out]">
                Buy
            </button>
            </div>
        )}
        </div>
    );
}

export default PopupBuyCourse;
