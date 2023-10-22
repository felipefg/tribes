import { useState } from "react";
import closeIcon from "@/assets/closeIcon.svg"
import Image from "next/image";

function PopupBuyCourse(props) {
    const [affiliate, setAffiliate] = useState("affiliate");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <div>
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
                Fill the affiliate address
            </h1>
            <input className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border" />

            <button className="bg-black w-full mt-6 h-8 rounded-xl text-whiteBackground hover:scale-[97%] duration-300 ease-in-out]">
                Buy
            </button>
            </div>
        )}
        {affiliate == "not-affiliate" && (
            <div>
            <p className="text-sm">{props.status}</p>
            <h1 className="text-xl font-medium mt-1">{props.title}</h1>
            <p>{props.description}</p>

            <button className="bg-black w-full mt-6 h-8 rounded-xl text-whiteBackground hover:scale-[97%] duration-300 ease-in-out]">
                Buy
            </button>
            </div>
        )}
        </div>
    );
}

export default PopupBuyCourse;
