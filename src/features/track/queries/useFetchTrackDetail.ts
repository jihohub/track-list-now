import { TrackDetail } from "@/types/track";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const fetchTrackDetail = async (
  trackId: string,
): Promise<TrackDetail> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get<TrackDetail>(
    `${baseUrl}/api/track/${trackId}`,
  );
  return response.data;
};

const useFetchTrackDetail = (trackId: string) => {
  return useQuery<TrackDetail, Error>({
    queryKey: ["track", trackId],
    queryFn: () => fetchTrackDetail(trackId),
    staleTime: 5 * 60 * 1000,
  });
};

export default useFetchTrackDetail;
