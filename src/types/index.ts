export interface Plant {
  _id: string;
  name: string;
  species?: string;
  location?: string;
  created_at: string;
}

export interface SensorData {
  plant_id: string;
  plant_name: string;
  timestamp: string;
  soil_moisture?: number;
  temperature?: number;
  humidity?: number;
  light?: number;
}

export interface TrendData {
  _id: string; // Date string
  avg_temp: number;
  avg_moisture: number;
  avg_humidity: number;
}

export interface AiAnalysisResult {
  diagnosis: string;
  confidence: number;
  actions: string[];
  watering_recommendation: string;
  notes: string;
}

export interface AiAnalysisResponse {
  status: string;
  ai_result: AiAnalysisResult;
  sensor_data_used: SensorData;
}

export interface ChatHistoryItem {
  timestamp: string;
  plant_id: string;
  sensor_data: SensorData;
  ai_result_parsed: AiAnalysisResult;
}

export interface ChatMessage {
  type: "user" | "ai";
  text: string;
}

export interface IdentificationResult {
  common_name: string;
  scientific_name: string;
  family: string;
  origin: string;
  growth_habit: string;
  flowering_season: string;
  edible_or_medicinal: string;
  uses: string[];
  care_summary: string;
  common_diseases: string[];
  diagnosis_from_image: string;
  image_url: string;
}
