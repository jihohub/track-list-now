import LoadingBar from "@/features/common/LoadingBar";
import useGlobalLoading from "@/hooks/useGlobalLoading";

const GlobalLoadingBar = () => {
  const isLoading = useGlobalLoading();

  return isLoading ? <LoadingBar /> : null;
};

export default GlobalLoadingBar;
