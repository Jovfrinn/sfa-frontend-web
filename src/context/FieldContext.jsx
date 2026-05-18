"use client";
import { createContext, useContext, useState } from "react";

const FieldContext = createContext();

export const useFieldContext = () => useContext(FieldContext);

export const FieldProvider = ({ children }) => {
  const [handleSaveFn, setHandleSaveFn] = useState(null);
  const [onEdit, setOnEdit] = useState(false);

  return (
    <FieldContext.Provider
      value={{ handleSaveFn, setHandleSaveFn, onEdit, setOnEdit }}
    >
      {children}
    </FieldContext.Provider>
  );
};
