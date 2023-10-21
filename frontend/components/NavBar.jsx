"use client";
import { useState } from "react";
import { useMetaMask } from "../contexts/WalletContext";
import Image from "next/image";
import Link from "next/link";
import logo from '../public/logo.svg'


export function NavBar() {
  const { account, connectMetaMask, disconnectMetaMask } = useMetaMask();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex justify-between font-semibold text-grey items-center my-6 mx-10">
      <div>
        <Link href='/' className="hover:scale-95 duration-300 ease-in-out">
            <Image src={logo} width={100}/>
        </Link>
      </div>
      <div className="flex justify-between w-1/3">
        <Link href='/' className="hover:scale-95 duration-300 ease-in-out">
            Launchpad
        </Link>
        <Link href='/' className="hover:scale-95 duration-300 ease-in-out">
            Courses
        </Link>
        <Link href='/' className="hover:scale-95 duration-300 ease-in-out">
            Profile
        </Link>
      </div>
      <div className="relative">
        {account ? (
          <>
            <button
              className="hover:scale-95 px-4 py-2 rounded-full border-[1px] border-grey transition duration-300 ease-in-out flex"
              onClick={toggleDropdown}
            >
              <p>
                {account.substring(0, 5) + "..." + account.substring(37, 42)}{" "}
              </p>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-full p-2">
                <ul>
                  <li>
                    <button onClick={disconnectMetaMask}>Disconnect</button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <button
            className="hover:scale-95 px-4 py-2 rounded-full border-[1px] border-grey transition duration-300 ease-in-out"
            onClick={connectMetaMask}
          >
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
