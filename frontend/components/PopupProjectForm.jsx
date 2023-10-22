import { useState } from "react";
import closeIcon from "@/assets/closeIcon.svg"
import Image from "next/image";

function PopupProjectForm(props) {

    return (
        <div>
            <div className="grid grid-cols-2 gap-10">
                    <div className="py-4">
                      <h1 className="pt-2 font-medium">Title</h1>
                      <input className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border" />
                      <h1 className="pt-2 font-medium">Description</h1>
                      <textarea className="rounded-xl w-full px-4 py-2 focus:outline-none text-sm border"></textarea>
                      <h1 className="pt-2 font-medium">Max revenue share</h1>
                      <input className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"/>
                      <h1 className="pt-2 font-medium">Min viable value</h1>
                      <input className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"/>
                      <h1 className="pt-2 font-medium">Pledged value</h1>
                      <input  className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"/>
                    </div>
                    <div className="py-4">
                      <h1 className="pt-2 font-medium">Auction duration</h1>
                      <input  className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"/>
                      <h1 className="pt-2 font-medium">Minimum bid</h1>
                      <input  className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"/>
                      <h1 className="pt-2 font-medium">Regular price</h1>
                      <input  className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"/>
                      <h1 className="pt-2 font-medium">Pre-Sale price</h1>
                      <input  className="rounded-xl w-full h-8 px-4 focus:outline-none text-sm border"/>
                      <button className="w-full h-10 bg-black text-whiteBackground mt-4 rounded-xl hover:scale-[97%] duration-300">Send</button>
                    </div>
                  </div>
        </div>
    );
}

export default PopupProjectForm;
