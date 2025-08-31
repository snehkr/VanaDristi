import React, { createContext, useContext } from "react";
import axios, { type AxiosInstance } from "axios";

const ApiClientContext = createContext<AxiosInstance | null>(null);

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider = ({
  children,
}: ApiProviderProps): React.ReactElement => {
  const apiClient = axios.create({
    baseURL: "https://api-vanadristi.snehkr.in/api/v1",
    headers: { "Content-Type": "application/json" },
  });

  return (
    <ApiClientContext.Provider value={apiClient}>
      {children}
    </ApiClientContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApiClient = (): AxiosInstance => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error("useApiClient must be used within an ApiProvider");
  }
  return context;
};
