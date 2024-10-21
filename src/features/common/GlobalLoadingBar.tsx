import LoadingBar from "@/features/common/LoadingBar";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const GlobalLoadingBar = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isFetching > 0 || isMutating > 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isFetching, isMutating]);

  return isLoading ? <LoadingBar /> : null;
};

export default GlobalLoadingBar;
