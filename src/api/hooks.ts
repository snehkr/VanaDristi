import {
  useQuery,
  useMutation,
  useQueryClient as useTanStackQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useApiClient } from "./index";
import type {
  Plant,
  SensorData,
  TrendData,
  AiAnalysisResponse,
  ChatHistoryItem,
  IdentificationResult,
} from "../types";
import { AxiosError } from "axios";

export const useApi = () => {
  const apiClient = useApiClient();
  const queryClient = useTanStackQueryClient();

  // Plants
  const useGetPlants = (
    options?: Omit<UseQueryOptions<Plant[], Error>, "queryKey" | "queryFn">
  ) =>
    useQuery<Plant[], Error>({
      queryKey: ["plants"],
      queryFn: async () => (await apiClient.get("/plants/")).data,
      ...options,
    });

  const useGetPlantById = (plantId: string) =>
    useQuery<Plant, Error>({
      queryKey: ["plant", plantId],
      queryFn: async () => (await apiClient.get(`/plants/${plantId}`)).data,
      enabled: !!plantId,
    });

  const useCreatePlant = () =>
    useMutation<Plant, Error, Omit<Plant, "_id" | "created_at">>({
      mutationFn: (newPlant) =>
        apiClient.post("/plants/", newPlant).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plants"] }),
    });

  const useUpdatePlant = () =>
    useMutation<
      Plant,
      Error,
      {
        plantId: string;
        updatedPlant: Partial<Omit<Plant, "_id" | "created_at">>;
      }
    >({
      mutationFn: ({ plantId, updatedPlant }) =>
        apiClient
          .put(`/plants/${plantId}`, updatedPlant)
          .then((res) => res.data),
      onSuccess: (_, { plantId }) => {
        queryClient.invalidateQueries({ queryKey: ["plants"] });
        queryClient.invalidateQueries({ queryKey: ["plant", plantId] });
      },
    });

  const useDeletePlant = () =>
    useMutation<unknown, Error, string>({
      mutationFn: (plantId) => apiClient.delete(`/plants/${plantId}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plants"] }),
    });

  // Latest Plant for Observations
  const useGetLatestPlant = () =>
    useQuery<{ _id: string } | null, Error>({
      queryKey: ["plants", "latest"],
      queryFn: async () => {
        try {
          const response = await apiClient.get("/plants/latest");
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 404) {
            return null;
          }
          throw error;
        }
      },
    });

  const useSetLatestPlant = () =>
    useMutation<unknown, Error, string>({
      mutationFn: (plantId) =>
        apiClient.post("/plants/latest", { plant_id: plantId }),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["plants", "latest"] }),
    });

  const useDeleteLatestPlant = () =>
    useMutation<unknown, Error, void>({
      mutationFn: () => apiClient.delete("/plants/latest"),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["plants", "latest"] }),
    });

  // Sensor Data
  const useGetLatestSensorData = (plantId: string) =>
    useQuery<SensorData, Error>({
      queryKey: ["sensor", "latest", plantId],
      queryFn: async () =>
        (await apiClient.get(`/sensor/latest/${plantId}`)).data,
      enabled: !!plantId,
    });

  const useGetSensorTrends = (plantId: string) =>
    useQuery<TrendData[], Error>({
      queryKey: ["sensor", "trends", plantId],
      queryFn: async () =>
        (await apiClient.get(`/sensor/trends/${plantId}`)).data,
      enabled: !!plantId,
    });

  // AI & Chat
  const useGetAiAnalysis = (plantId: string) =>
    useQuery<AiAnalysisResponse, Error>({
      queryKey: ["ai", "analysis", plantId],
      queryFn: async () =>
        (await apiClient.get(`/ai/analysis?plant_id=${plantId}`)).data,
      enabled: !!plantId,
      retry: 1,
    });

  const useGetLatestAnalysis = (
    options?: Omit<
      UseQueryOptions<ChatHistoryItem | null, Error>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery<ChatHistoryItem | null, Error>({
      queryKey: ["chatHistory", "latest"],
      queryFn: async () => {
        const { data } = await apiClient.get<ChatHistoryItem[]>(
          "/ai/chat_history?limit=1"
        );
        return data.length > 0 ? data[0] : null;
      },
      ...options,
    });

  const usePostChatMessage = () =>
    useMutation<
      { response: string },
      Error,
      { plant_id: string; question: string }
    >({
      mutationFn: (chatData) =>
        apiClient.post("/ai/chat", chatData).then((res) => res.data),
    });

  // hook to fetch all identified plants
  const useGetIdentifications = (
    options?: Omit<
      UseQueryOptions<IdentificationResult[], Error>,
      "queryKey" | "queryFn"
    >
  ) =>
    useQuery<IdentificationResult[], Error>({
      queryKey: ["identifications"],
      queryFn: async () => (await apiClient.get("/ai/identifications")).data,
      ...options,
    });

  const useIdentifyPlant = () =>
    useMutation<IdentificationResult, Error, FormData>({
      mutationFn: (formData) =>
        apiClient
          .post("/ai/identify", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => res.data),
      onSuccess: () => {
        // When a new plant is identified, invalidate the list to refetch it.
        queryClient.invalidateQueries({ queryKey: ["identifications"] });
      },
    });

  return {
    useGetPlants,
    useGetPlantById,
    useCreatePlant,
    useUpdatePlant,
    useDeletePlant,
    useGetLatestSensorData,
    useGetSensorTrends,
    useGetAiAnalysis,
    useGetLatestAnalysis,
    usePostChatMessage,
    useIdentifyPlant,
    useGetIdentifications,
    useGetLatestPlant,
    useSetLatestPlant,
    useDeleteLatestPlant,
  };
};
