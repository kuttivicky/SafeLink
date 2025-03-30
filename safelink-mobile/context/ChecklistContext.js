import React, { createContext, useState } from 'react';

export const ChecklistContext = createContext();

export const ChecklistProvider = ({ children }) => {
  const [checklists, setChecklists] = useState([]);

  const addChecklist = (patientInfo, checklist) => {
    setChecklists((prev) => [
      ...prev,
      { id: Date.now().toString(), patientInfo, checklist },
    ]);
  };

  return (
    <ChecklistContext.Provider value={{ checklists, addChecklist }}>
      {children}
    </ChecklistContext.Provider>
  );
};