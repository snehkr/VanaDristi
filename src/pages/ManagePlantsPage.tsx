import { useState, useEffect } from "react";
import { useApi } from "../api/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import SelectablePlantCard from "../components/SelectablePlantCard";
import { Sprout, Check } from "lucide-react";

const ManagePlantsPage = (): React.ReactElement => {
  const {
    useGetPlants,
    useGetLatestPlant,
    useSetLatestPlant,
    useDeleteLatestPlant,
  } = useApi();

  const { data: plants, isLoading: isLoadingPlants } = useGetPlants();
  const { data: latestPlant, isLoading: isLoadingLatestPlant } =
    useGetLatestPlant();
  const setLatestPlant = useSetLatestPlant();
  const deleteLatestPlant = useDeleteLatestPlant();

  const [selectedPlantId, setSelectedPlantId] = useState<string>("");
  const [initialPlantId, setInitialPlantId] = useState<string>("");

  useEffect(() => {
    if (latestPlant?._id) {
      setSelectedPlantId(latestPlant._id);
      setInitialPlantId(latestPlant._id);
    } else {
      setSelectedPlantId("");
      setInitialPlantId("");
    }
  }, [latestPlant]);

  const handleSelectPlant = (plantId: string) => {
    setSelectedPlantId(plantId);
  };

  const handleSave = () => {
    if (selectedPlantId) {
      setLatestPlant.mutate(selectedPlantId, {
        onSuccess: () => {
          setInitialPlantId(selectedPlantId);
          toast({
            title: "Success!",
            description: "Observation plant has been updated.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not set the plant for observation.",
          });
        },
      });
    }
  };

  const handleRemove = () => {
    deleteLatestPlant.mutate(undefined, {
      onSuccess: () => {
        setSelectedPlantId("");
        setInitialPlantId("");
        toast({
          title: "Success!",
          description: "Observation plant has been removed.",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Could not remove the plant from observation.",
        });
      },
    });
  };

  const isLoading = isLoadingPlants || isLoadingLatestPlant;
  const isDirty = selectedPlantId !== initialPlantId;

  const EmptyState = () => (
    <div className="text-center p-8 md:p-16 col-span-full">
      <Sprout className="mx-auto h-16 w-16 text-green-700 opacity-50" />
      <h3 className="mt-4 text-xl font-semibold text-stone-800">
        No Plants Found
      </h3>
      <p className="mt-2 text-sm text-stone-500">
        It looks a little empty in here. Add a plant to get started.
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-green-900">
          Observation Target
        </h1>
        <p className="text-stone-600 mt-1">
          Choose which plant to use for active sensor observation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select a Plant</CardTitle>
          <CardDescription>
            Click on a plant below to select it for observation. The selected
            plant will provide the data for the dashboard and other monitoring
            features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full" />
              ))}
            </div>
          ) : !plants || plants.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {plants.map((plant) => (
                <SelectablePlantCard
                  key={plant._id}
                  plant={plant}
                  isCurrent={initialPlantId === plant._id}
                  isSelected={selectedPlantId === plant._id}
                  onSelect={handleSelectPlant}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {isDirty && (
        <div className="sticky bottom-6 mt-6 bg-white/80 backdrop-blur-lg p-4 rounded-lg shadow-lg border border-stone-200/80 flex items-center justify-between animate-in fade-in-50">
          <p className="text-sm font-medium text-stone-700">
            You have unsaved changes.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={setLatestPlant.isPending}>
              <Check className="mr-2 h-4 w-4" />
              {setLatestPlant.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedPlantId(initialPlantId)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlantsPage;
