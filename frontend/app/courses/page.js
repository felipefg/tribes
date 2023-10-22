"use client";
import { useState } from "react";
import Image from "next/image";
import gradient5 from "@/assets/gradient5.svg";
import magnifier from "@/assets/magnifier.svg";
import closeIcon from "@/assets/closeIcon.svg"
import Popup from "@/components/Popup";


const Courses = () => {
  const [filter, setFilter] = useState("");
  const [buttonClicked, setButtonClicked] = useState('pre-sale');
  const [affiliate, setAffiliate] = useState('affiliate')
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')


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

  const handleClick = async (status, title, description) => {
    setIsPopupOpen(true)
    setTitle(title)
    setDescription(description)
    setStatus(status)
  }

  

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          draggable={false}
          src={gradient5}
          width={400}
          className="absolute right-0 -top-28 z-0"
        />
        <div className="mt-12 z-10 relative pt-16">
          <div className="relative px-20 flex justify-between">
            <h1 className="text-4xl font-medium">Available courses</h1>
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
                <p className="px-4 text-sm"></p>
                <h1 className="font-semibold text-xl pb-6 px-4">
                  {item.title}
                </h1>
                <p className="text-sm py-2 px-4">{item.description}</p>
                <div className="flex justify-center mt-4">
                  <button className="bg-black px-16 py-1 rounded-full text-whiteBackground text-sm" onClick={() => handleClick(item.status, item.title, item.description)}>
                    See more
                  </button>
                  <Popup isOpen={isPopupOpen} >
                  <div className="flex justify-between"> 
                    <h1 className="text-3xl font-medium">Buy Course</h1>  
                    <button onClick={() => setIsPopupOpen(false)} className="hover:scale-95 duration-300">
                      <Image draggable={false} src={closeIcon} width={15} height={15}/>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-10 py-4">
                    <button className={`px-4 py-1 rounded-full ${affiliate == 'not-affiliate' ? 'bg-black text-whiteBackground' : 'border text-black '}`} onClick={() => setAffiliate("not-affiliate")}>Buy</button>
                    <button className={`px-4 py-1 rounded-full ${affiliate == 'affiliate' ? 'bg-black text-whiteBackground' : 'border text-black bg-whiteBackground'}`}  onClick={() => setAffiliate("affiliate")}>Buy with Affiliate</button>
                  </div>
                  {affiliate == 'affiliate' && (
                    <div>
                      <p className="text-sm">{status}</p>
                      <h1 className="text-xl font-medium mt-1">{title}</h1>
                      <p>{description}</p>
                      
                      <h1 className="text-lg font-medium mt-8">Fill the affiliate address</h1>
                      <input className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border" />

                      <button className="bg-black w-full mt-6 h-8 rounded-xl text-whiteBackground hover:scale-[97%] duration-300 ease-in-out]">Buy</button>
                    </div>
                  )}
                  {affiliate == 'not-affiliate' && (
                    <div>
                      <p className="text-sm">{status}</p>
                      <h1 className="text-xl font-medium mt-1">{title}</h1>
                      <p>{description}</p>
                      
                      <button className="bg-black w-full mt-6 h-8 rounded-xl text-whiteBackground hover:scale-[97%] duration-300 ease-in-out]">Buy</button>
                    </div>
                  )}
                  
                </Popup>
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
