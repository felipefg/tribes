"use client";
import { useEffect } from "react";
import { useAuctionContext } from "@/contexts/AuctionContext";
import { useRouter } from "next/navigation";
import gradient4 from "@/assets/gradient4.svg";
import gradient6 from "@/assets/gradient6.svg";
import Image from "next/image";

const AuctionDetails = () => {
  const { selectedAuction } = useAuctionContext();
  console.log(selectedAuction)
  const router = useRouter();

  useEffect(() => {
    if (selectedAuction == null){
      console.log("teste")
      router.push("/launchpad");
    }
  }, [selectedAuction])

  return (
    <div className="w-full">
      <div className="relative">
        <Image
          src={gradient4}
          width={300}
          className="absolute left-0 -top-28 z-0"
        />
      </div>
      <div className="flex justify-between px-20 py-4 z-10 relative">
        <div className="w-1/2">
        <div className="relative z-10 pt-16">
          <h1 className="text-4xl font-medium">{selectedAuction?.title}</h1>
          <p className="font-medium pt-2 text-lg">
            Created by 0x00000000000000
          </p>
        </div>
            <div className="grid grid-cols-3 gap-12 py-4">
                <div className="flex flex-col justify-center items-center w-36">
                    <h1 className="text-3xl font-medium">10 %</h1>
                    <p className="text-sm text-center">Maximum rate of return</p>
                </div>
                <div className="flex flex-col justify-center items-center w-36">
                    <h1 className="text-3xl font-medium">1 ETH </h1>
                    <p className="text-sm text-center">minimum bid amount</p>
                </div>
                <div className="flex flex-col justify-center items-center w-36">
                    <h1 className="text-3xl font-medium">15 ETH</h1>
                    <p className="text-sm text-center">minimum required to start project</p>
                </div>     
            </div>
            <div className="grid grid-cols-3 gap-12 py-4">
                <div className="flex flex-col justify-center items-center w-36">
                    <h1 className="text-3xl font-medium">87%</h1>
                    <p className="text-sm text-center">Percentage raised</p>
                </div>
                <div className="flex flex-col justify-center items-center w-36">
                    <h1 className="text-2xl font-medium">Finished</h1>
                    <p className="text-sm text-center">Auction status</p>
                </div>
                <div className="flex flex-col justify-center items-center w-36">
                    <h1 className="text-2xl font-medium">11/11/2023</h1>
                    <p className="text-sm text-center">End of auction</p>
                </div>     
            </div>
            <p className="py-8">
            Learn how to use your Python to develop decentralized applications on Web 3.0.

            Learn how to master your python skills and apply it to breate decentralized apps.

            Course and classes with Msc Felipe an AI specialist and seasoned developer using python for AI DApps in Web 3.0 .
            </p>
        </div >
        <div className="border w-4/12 rounded-tl-xl rounded-tr-[56px] rounded-bl-[56px] rounded-br-xl py-24 mt-12 mr-16 relative">
            <Image src={gradient6} className="absolute -top-16 left-16 z-0" />
            <div className="relative z-10 px-12">
                <h1 className="text-3xl font-medium">New bid</h1>
                <div className="pt-12">
                    <p>Rev share target</p>
                    <input className="rounded-full border w-full h-7 px-4 focus:outline-none text-sm" />
                </div>
                <div className="pt-6">
                    <p>Value</p>
                    <input className="rounded-full border w-full h-7 px-4 focus:outline-none text-sm" />
                </div>
                <button className="w-full bg-black mt-16 rounded-full text-whiteBackground h-8 hover:scale-[97%] duration-300 ease-in-out" >Place a bid</button>
            </div>
            
        </div>

      </div>
    </div>
  );
};
export default AuctionDetails;

// export async function getServerSideProps(context) {
//   // Coloque aqui a lógica para buscar o `selectedAuction`
//   // Exemplo: const selectedAuction = await fetchAuctionDetails();

//   if (!selectedAuction) {
//     // Redirecione para a página inicial se o `selectedAuction` não existir
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       selectedAuction,
//     },
//   };
// }