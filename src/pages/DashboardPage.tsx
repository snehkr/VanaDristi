import { Link } from "react-router-dom";
import { useApi } from "@/api/hooks";
import PlantCard from "@/components/PlantCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sprout,
  HeartPulse,
  ClipboardX,
  AlertCircle,
  Droplets,
  Sun,
  Thermometer,
  Waves,
  SlidersHorizontal,
} from "lucide-react";
import type { ChatHistoryItem, SensorData } from "@/types";

// Helper for diagnosis styles
const getDiagnosisStyle = (diagnosis: string | undefined) => {
  if (!diagnosis)
    return {
      icon: AlertCircle,
      color: "text-stone-500",
      bgColor: "bg-stone-100",
    };
  switch (diagnosis.toLowerCase()) {
    case "healthy":
      return {
        icon: HeartPulse,
        color: "text-green-700",
        bgColor: "bg-green-100",
      };
    case "needs water":
      return { icon: Droplets, color: "text-blue-600", bgColor: "bg-blue-100" };
    case "overwatered":
      return { icon: Droplets, color: "text-sky-600", bgColor: "bg-sky-100" };
    case "environmental stress (light/temp)":
      return { icon: Sun, color: "text-amber-600", bgColor: "bg-amber-100" };
    default:
      return {
        icon: AlertCircle,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
  }
};

// Component for Latest Analysis (unchanged)
const LatestAnalysisCard = ({
  analysis,
  isLoading,
}: {
  analysis: ChatHistoryItem | null;
  isLoading: boolean;
}) => {
  // ... (same as previous version)
  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }
  if (!analysis) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-6">
        <ClipboardX className="h-12 w-12 text-stone-400 mb-2" />
        <p className="font-semibold text-stone-700">No Analysis Found</p>
        <p className="text-sm text-stone-500">
          Perform an analysis on a plant's detail page.
        </p>
      </Card>
    );
  }
  const {
    icon: Icon,
    color,
    bgColor,
  } = getDiagnosisStyle(analysis.ai_result_parsed?.diagnosis);
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Latest Health Alert</CardTitle>
        <CardDescription>
          The most recent AI analysis from your collection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-stone-50/80 rounded-lg border">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <div className="flex-grow">
            <p className="font-bold text-lg text-stone-800">
              {analysis.sensor_data?.plant_name}
            </p>
            <p className={`font-semibold ${color}`}>
              {analysis.ai_result_parsed?.diagnosis}
            </p>
            <p className="text-sm text-stone-600 mt-1 line-clamp-2">
              {analysis.ai_result_parsed?.notes}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full sm:w-auto flex-shrink-0"
          >
            <Link to={`/plant/${analysis.plant_id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ** NEW ** Component for Latest Sensor Reading
const LatestSensorCard = ({
  sensorData,
  isLoading,
}: {
  sensorData: SensorData | null;
  isLoading: boolean;
}) => {
  const sensorItems = [
    {
      icon: Thermometer,
      label: "Temp",
      value: sensorData?.temperature,
      unit: "°C",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: sensorData?.humidity,
      unit: "%",
    },
    {
      icon: Waves,
      label: "Moisture",
      value: sensorData?.soil_data?.Soil_Moisture,
      unit: "%",
    },
    {
      icon: Sun,
      label: "Light",
      value: sensorData?.light_intensity,
      unit: " lux",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Latest Sensor Reading
        </CardTitle>
        <SlidersHorizontal className="h-4 w-4 text-stone-500" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !sensorData ? (
          <div className="flex items-center justify-center h-24 text-sm text-stone-500">
            No sensor data available.
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {sensorItems.map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-stone-500">{item.label}</p>
                  <p className="text-lg font-bold">
                    {item.value !== undefined
                      ? `${item.value.toFixed(1)}${item.unit}`
                      : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {sensorData && (
        <CardFooter className="text-xs text-stone-500 pt-2">
          From '{sensorData.plant_name}' at{" "}
          {(() => {
            const date = new Date(
              sensorData.timestamp.replace(" ", "T").split(".")[0]
            );
            date.setHours(date.getHours() + 5);
            date.setMinutes(date.getMinutes() + 30);
            return date.toLocaleTimeString("en-IN", { hour12: true });
          })()}
        </CardFooter>
      )}
    </Card>
  );
};

const DashboardPage = (): React.ReactElement => {
  // Auto-refresh data every 60 seconds
  const refetchInterval = 60 * 1000;

  const { useGetPlants, useGetLatestAnalysis } = useApi();
  const { data: plants, isLoading: isLoadingPlants } = useGetPlants({
    refetchInterval,
  });
  const { data: latestAnalysis, isLoading: isLoadingAnalysis } =
    useGetLatestAnalysis({ refetchInterval });

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <p className="text-sm text-stone-600">{date}</p>
        <h1 className="text-4xl font-bold text-green-900">
          Welcome to VanaDristi
        </h1>
        <p className="text-stone-600 mt-1">
          Here's a summary of your plant ecosystem, updated every minute.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
            <Sprout className="h-4 w-4 text-stone-500" />
          </CardHeader>
          <CardContent>
            {isLoadingPlants ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{plants?.length || 0}</div>
            )}
            <p className="text-xs text-stone-500">Currently being monitored</p>
          </CardContent>
        </Card>

        {/* New Sensor Card added here */}
        <LatestSensorCard
          sensorData={latestAnalysis?.sensor_data ?? null}
          isLoading={isLoadingAnalysis}
        />
      </div>

      {/* Latest Analysis Card */}
      <LatestAnalysisCard
        analysis={latestAnalysis ?? null}
        isLoading={isLoadingAnalysis}
      />

      {/* Your Plants Section */}
      <div>
        <h2 className="text-3xl font-bold text-green-900 mb-6">Your Plants</h2>
        {isLoadingPlants ? (
          // ... (same skeleton as before)
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full" />
            ))}
          </div>
        ) : !plants || plants.length === 0 ? (
          // ... (same empty state as before)
          <div className="text-center p-8 md:p-16 bg-stone-50 rounded-lg border-2 border-dashed">
            <Sprout className="mx-auto h-16 w-16 text-green-700 opacity-50" />
            <h3 className="mt-4 text-xl font-semibold text-stone-800">
              Your Garden Awaits
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Add your first plant to begin monitoring its health and growth.
            </p>
            <Button asChild className="mt-6">
              <Link to="/manage-plants">Add a Plant</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
