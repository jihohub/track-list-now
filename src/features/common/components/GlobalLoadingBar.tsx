import LoadingBar from "@/features/common/components/LoadingBar";
import useGlobalLoading from "@/hooks/useGlobalLoading";

const GlobalLoadingBar = () => {
  const isLoading = useGlobalLoading();

  return isLoading ? <LoadingBar /> : null;
};

export default GlobalLoadingBar;
