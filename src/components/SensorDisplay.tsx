import { useApi } from "@/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets, Sun, Thermometer, Waves } from "lucide-react";

interface SensorDisplayProps {
  plantId: string;
}

const SensorDisplay = ({ plantId }: SensorDisplayProps): React.ReactElement => {
  const { useGetLatestSensorData } = useApi();
  const { data, isLoading } = useGetLatestSensorData(plantId);

  const sensorItems = [
    {
      icon: Thermometer,
      label: "Temperature",
      value: data?.temperature,
      unit: "°C",
      color: "text-orange-600",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: data?.humidity,
      unit: "%",
      color: "text-sky-600",
    },
    {
      icon: Waves,
      label: "Soil Moisture",
      value: data?.soil_moisture,
      unit: "%",
      color: "text-blue-600",
    },
    {
      icon: Sun,
      label: "Light",
      value: data?.light,
      unit: " lux",
      color: "text-amber-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Sensor Data</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          : sensorItems.map((item) => (
              <div
                key={item.label}
                className="p-4 bg-stone-100/50 rounded-lg border border-stone-200/80"
              >
                <div className="flex items-center text-stone-600 mb-1">
                  <item.icon className={`w-5 h-5 mr-2 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <p className="text-3xl font-bold text-stone-800">
                  {item.value !== undefined && item.value !== null
                    ? `${item.value.toFixed(1)}`
                    : "N/A"}
                  {item.value !== undefined && item.value !== null && (
                    <span className="text-lg font-normal text-stone-500">
                      {item.unit}
                    </span>
                  )}
                </p>
              </div>
            ))}
      </CardContent>
    </Card>
  );
};

export default SensorDisplay;
