// LoadingContext.js
import { createContext, useContext, useState } from "react";
import Loading from "../../components/Loading";

const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {isLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};
