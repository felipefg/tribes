'use client'
import { createContext, useContext, useState } from 'react';

const ProjectDetailContext = createContext();

export const useProjectDetailContext = () => {
  return useContext(AuctionContext);
};

export const ProjectDetailProvider = ({ children }) => {
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);

  const selectProjectDetail = (course) => {
    setSelectedProjectDetail(course);
  };

  return (
    <ProjectDetailContext.Provider value={{ selectedProjectDetail, selectProjectDetail }}>
      {children}
    </ProjectDetailContext.Provider>
  );
};
