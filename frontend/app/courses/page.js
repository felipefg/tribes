"use client";
import axios from "axios";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Image from "next/image";
import gradient5 from "@/assets/gradient5.svg";
import magnifier from "@/assets/magnifier.svg";
import Popup from "@/components/Popup";
import PopupBuyCourse from "@/components/PopupBuyCourse";
import closeIcon from "@/assets/closeIcon.svg";

const Courses = () => {
  //const [filter, setFilter] = useState("");
  const [buttonClicked, setButtonClicked] = useState("all");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [project_id, setProjectId] = useState("");
  const [responseApi, setResponseApi] = useState([]);
  const [tribeAddress, setTribeAddress] = useState("");

  const handleClick = async (status, title, description, id, tribe_address) => {
    setIsPopupOpen(true);
    setProjectId(id);
    setTitle(title);
    setDescription(description);
    setStatus(status);
    setTribeAddress(tribe_address);
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          "https://tribes.felipefg.org/inspect/project"
        );
        const data = response.data;
        const payload = ethers.toUtf8String(data.reports[0].payload);
        const payloadArray = JSON.parse(payload);
        setResponseApi(payloadArray);

        return data;
      } catch (error) {
        console.error("Erro na solicitação da API:", error);
        throw error;
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          alt="decoration"
          draggable={false}
          src={gradient5}
          width={400}
          className="absolute right-0 -top-28 z-0"
        />
        <div className="mt-12 z-10 relative pt-16">
          <div className="relative px-20 flex justify-between">
            <h1 className="text-4xl font-medium">Available courses</h1>
            {/* <div className="flex gap-3">
              <input
                type="text"
                className="rounded-full w-64 h-8 px-4 focus:outline-none text-sm"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Image src={magnifier} />
            </div> */}
          </div>
          <div className="flex px-20 pt-4 gap-2">
            <button
              className={`px-4 py-1 rounded-full ${
                buttonClicked == "all"
                  ? "bg-black text-whiteBackground"
                  : "border text-black "
              }`}
              onClick={() => setButtonClicked("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-1 rounded-full ${
                buttonClicked == "pre-sale"
                  ? "bg-black text-whiteBackground"
                  : "border text-black bg-whiteBackground"
              }`}
              onClick={() => setButtonClicked("pre-sale")}
            >
              Pre-sale
            </button>
          </div>
          <div className="px-20 py-8 grid grid-cols-3 gap-16">
            {buttonClicked == "all" &&
              responseApi.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2"
                >
                  <p className="px-4 text-sm"></p>
                  <h1 className="font-semibold text-xl pb-6 px-4">
                    {item.name}
                  </h1>
                  <p className="text-sm py-2 px-4">{item.description}</p>
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-black px-16 py-1 rounded-full text-whiteBackground text-sm"
                      onClick={() =>
                        handleClick(
                          item.status,
                          item.title,
                          item.description,
                          item.project_id,
                          item.tribe_address
                        )
                      }
                    >
                      See more
                    </button>
                    <Popup isOpen={isPopupOpen}>
                      <div className="flex justify-between">
                        <h1 className="text-3xl font-medium">Buy Course</h1>
                        <button
                          onClick={() => setIsPopupOpen(false)}
                          className="hover:scale-95 duration-300"
                        >
                          <Image
                            alt="decoration"
                            draggable={false}
                            src={closeIcon}
                            width={15}
                            height={15}
                          />
                        </button>
                      </div>
                      <PopupBuyCourse
                        status={status}
                        title={title}
                        description={description}
                        project_id={project_id}
                        tribe_address={tribeAddress}
                      />
                    </Popup>
                  </div>
                </div>
              ))}
            {buttonClicked == "pre-sale" &&
              responseApi.map((item) =>
                item.is_presales == false ? (
                  ""
                ) : (
                  <div
                    key={index}
                    className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2"
                  >
                    <p className="px-4 text-sm"></p>
                    <h1 className="font-semibold text-xl pb-6 px-4">
                      {item.name}
                    </h1>
                    <p className="text-sm py-2 px-4">{item.description}</p>
                    <div className="flex justify-center mt-4">
                      <button
                        className="bg-black px-16 py-1 rounded-full text-whiteBackground text-sm"
                        onClick={() =>
                          handleClick(
                            item.status,
                            item.title,
                            item.description,
                            item.project_id
                          )
                        }
                      >
                        See more
                      </button>
                      <Popup isOpen={isPopupOpen}>
                        <div className="flex justify-between">
                          <h1 className="text-3xl font-medium">Buy Course</h1>
                          <button
                            onClick={() => setIsPopupOpen(false)}
                            className="hover:scale-95 duration-300"
                          >
                            <Image
                              alt="decoration"
                              draggable={false}
                              src={closeIcon}
                              width={15}
                              height={15}
                            />
                          </button>
                        </div>
                        <PopupBuyCourse
                          status={status}
                          title={title}
                          description={description}
                          project_id={project_id}
                          tribeAddress={tribeAddress}
                        />
                      </Popup>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Courses;
