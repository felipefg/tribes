"use client";
import { useState } from "react";
import { useMetaMask } from "../../contexts/WalletContext";
import Image from "next/image";
import gradient4 from "@/assets/gradient4.svg";
import wallet from "@/assets/wallet.svg"

const Profile = () => {

    const { account } = useMetaMask();
    const [buttonClicked, setButtonClicked] = useState('purchased-courses');


  return (
    <div className="w-full">
      <div className="relative">
        <Image
          src={gradient4}
          width={300}
          className="absolute left-0 -top-28 z-0"
        />
        <div className="relative z-10 pt-16 px-20">
          <h1 className="text-4xl font-medium">Profile</h1>
          <div className="flex gap-2 pt-1">
            <Image src={wallet} />
            <p className="font-medium pt-2 text-lg">
                {account ? account : "Connect your wallet"}
            </p>
          </div>   
        </div>
        <div className="divide-y divide-purple px-20">
            <div className="flex gap-20 z-10 relative pt-12 pb-6">
                <button className={`rounded-lg px-2 ${buttonClicked === 'purchased-courses' ? 'bg-purple' : ''}`}onClick={() => setButtonClicked("purchased-courses")}>Purchased courses</button>
                <button className={`rounded-lg px-2 ${buttonClicked === 'bids-made' ? 'bg-purple' : ''}`}onClick={() => setButtonClicked("bids-made")}>My bids</button>
                <button className={`rounded-lg px-2 ${buttonClicked === 'courses-created' ? 'bg-purple' : ''}`}onClick={() => setButtonClicked("courses-created")}>Creator's dashboard</button>
            </div>
            <div>

            </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
