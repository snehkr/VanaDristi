import { Link, useParams } from "react-router-dom";
import { useApi } from "@/api/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import SensorDisplay from "@/components/SensorDisplay";
import TrendsChart from "@/components/TrendsChart";
import AiChatbot from "@/components/AiChatbot";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Tag, MapPin, SearchX, ArrowLeft } from "lucide-react";

const PlantDetailPage = (): React.ReactElement => {
  const { plantId } = useParams<{ plantId: string }>();
  const { useGetPlantById } = useApi();
  const { data: plant, isLoading, isError } = useGetPlantById(plantId!);

  // A more visually appealing loading state that mimics the final layout
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-28 w-full" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <div className="w-full lg:w-1/3">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // An improved "Not Found" or error state
  if (isError || !plant || !plantId) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <SearchX className="h-16 w-16 text-stone-400 mb-4" />
        <h2 className="text-2xl font-bold text-stone-800">Plant Not Found</h2>
        <p className="text-stone-500 mt-2">
          Sorry, we couldn't find the plant you're looking for.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Header Card for Plant Details */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-stone-50/80 p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100/80 p-3 rounded-lg mt-1">
              <Sprout className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-900">
                {plant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-stone-600">
                {plant.species && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    <span>{plant.species}</span>
                  </div>
                )}
                {plant.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{plant.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Responsive Main Content Area using Flexbox */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sensor and Chart Data (appears second on mobile, first on desktop) */}
        <div className="w-full lg:w-2/3 space-y-6 order-2 lg:order-1">
          <SensorDisplay plantId={plantId} />
          <TrendsChart plantId={plantId} />
        </div>

        {/* AI Chatbot (appears first on mobile, second on desktop) */}
        <div className="w-full lg:w-1/3 order-1 lg:order-2">
          <AiChatbot plantId={plantId} />
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
