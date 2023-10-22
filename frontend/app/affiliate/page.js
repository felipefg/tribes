"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import gradient5 from "@/assets/gradient5.svg";
import magnifier from "@/assets/magnifier.svg";
import Supporters from "@/abis/Supporters"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Courses = () => {
  const [filter, setFilter] = useState("");
  const [buttonClicked, setButtonClicked] = useState('pre-sale');
  const [contract, setContract] = useState('')

  const itens = [
    { 
      title: "Learn Python on Web3",
      description:
        "Learn how to use your Python to develop decentralized applications on Web 3.0",
      status: "Normal-sale"
    },
    {
      title: "Front-end for Web3",
      description:
        "Learn with Web-Manu all tricks to build the right front end for Web 3.0 applications.",
        status: "Pre-sale"
    },
    {
      title: "Intro to Cartesi Gaming",
      description:
        "Learn how to develop and deploy your web game using Cartesi gaming infrastructure",
        status: "Pre-sale"
    },
    {
      title: "Learn Go on Web 3.0",
      description:
        "Learn how to use Go, one of the most popular programming languages, on Web 3.0",
        status: "Pre-sale"
    },
  ];

  const filteredItems = itens
    .filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
    .filter((item) => item.status.toLowerCase() === buttonClicked)


    const initializeContract = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          const contractAddress = "0x1da9e4e40378b949c494394a243112519681eecc";
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner();
  
          const connect_contract = new ethers.Contract(
            contractAddress,
            Supporters.abi,
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
  
    const handleAffiliate = async () => {
      try {
        await contract.claimAffiliation() 
        notify()
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    useEffect(() => {
      initializeContract();
    }, []);

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
          src={gradient5}
          width={400}
          className="absolute right-0 -top-28 z-0"
        />
        <div className="mt-12 z-10 relative pt-16">
          <div className="relative px-20 flex justify-between">
            <h1 className="text-4xl font-medium">Affiliate course</h1>
            <div className="flex gap-3">
              <input
                type="text"
                className="rounded-full w-64 h-8 px-4 focus:outline-none text-sm"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Image src={magnifier} />
            </div>
          </div>
          <div className="flex px-20 pt-4 gap-2">
            <button className={`px-4 py-1 rounded-full ${buttonClicked == 'normal-sale' ? 'bg-black text-whiteBackground' : 'border text-black '}`} onClick={() => setButtonClicked("normal-sale")}>Normal-sale</button>
            <button className={`px-4 py-1 rounded-full ${buttonClicked == 'pre-sale' ? 'bg-black text-whiteBackground' : 'border text-black bg-whiteBackground'}`}  onClick={() => setButtonClicked("pre-sale")}>Pre-sale</button>
          </div>
          <div className="px-20 py-8 grid grid-cols-3 gap-16">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2"
              >
                <p className="px-4 text-sm">{item.status}</p>
                <h1 className="font-semibold text-xl pb-6 px-4">
                  {item.title}
                </h1>
                <p className="text-sm py-2 px-4">{item.description}</p>
                <div className="flex justify-center mt-4">
                  <button 
                  onClick={handleAffiliate}
                  className="bg-black px-16 py-1 rounded-full text-whiteBackground text-sm" >
                     Affiliate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Courses;
