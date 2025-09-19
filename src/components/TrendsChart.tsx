import { useApi } from "@/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendsChartProps {
  plantId: string;
}

const TrendsChart = ({ plantId }: TrendsChartProps): React.ReactElement => {
  const { useGetSensorTrends } = useApi();
  const { data: trends, isLoading } = useGetSensorTrends(plantId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Trends (Daily Avg)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : !trends || trends.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-stone-500">
            No trend data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={trends}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#d1d5db",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avg_temp"
                name="Temp (°C)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="avg_moisture"
                name="Moisture (%)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="avg_humidity"
                name="Humidity (%)"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendsChart;
