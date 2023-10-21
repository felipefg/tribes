'use client'
import { createContext, useContext, useState } from 'react';

const AuctionContext = createContext();

export const useAuctionContext = () => {
  return useContext(AuctionContext);
};

export const AuctionProvider = ({ children }) => {
  const [selectedAuction, setSelectedAuction] = useState(null);

  const selectAuction = (course) => {
    setSelectedAuction(course);
  };

  return (
    <AuctionContext.Provider value={{ selectedAuction, selectAuction }}>
      {children}
    </AuctionContext.Provider>
  );
};
