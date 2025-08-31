import { useState } from "react";
import { useApi } from "../api/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import PlantForm from "../components/PlantForm";
import { PlusCircle, Pencil, Trash2, Sprout } from "lucide-react";
import type { Plant } from "@/types";

const ManagePlantsPage = (): React.ReactElement => {
  const { useGetPlants, useDeletePlant } = useApi();
  const { data: plants, isLoading } = useGetPlants();
  const deletePlant = useDeletePlant();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const handleAddNew = () => {
    setEditingPlant(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setIsDialogOpen(true);
  };

  const handleDelete = (plantId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this plant? This action cannot be undone."
      )
    ) {
      deletePlant.mutate(plantId);
    }
  };

  // Component for the empty state when no plants are found
  const EmptyState = () => (
    <div className="text-center p-8 md:p-16">
      <Sprout className="mx-auto h-16 w-16 text-green-700 opacity-50" />
      <h3 className="mt-4 text-xl font-semibold text-stone-800">
        No Plants Found
      </h3>
      <p className="mt-2 text-sm text-stone-500">
        It looks a little empty in here. Get started by adding your first plant.
      </p>
      <Button onClick={handleAddNew} className="mt-6">
        <PlusCircle className="mr-2 h-4 w-4" /> Add New Plant
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-green-900">Manage Plants</h1>
          <p className="text-stone-600 mt-1">
            Add, edit, or remove your plants.
          </p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Plant
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            // Unified skeleton for both mobile and desktop
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : !plants || plants.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {/* Desktop Table View (hidden on small screens) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-stone-600">
                  <thead className="text-xs text-stone-700 uppercase bg-stone-100/70">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Species
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plants.map((plant) => (
                      <tr
                        key={plant._id}
                        className="bg-white border-b hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-stone-900">
                          {plant.name}
                        </td>
                        <td className="px-6 py-4">{plant.species || "N/A"}</td>
                        <td className="px-6 py-4">{plant.location || "N/A"}</td>
                        <td className="px-6 py-4 text-right">
                          <TooltipProvider>
                            <div className="flex justify-end space-x-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(plant)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Plant</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(plant._id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Plant</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (hidden on medium screens and up) */}
              <div className="md:hidden p-4 space-y-4 bg-stone-50">
                {plants.map((plant) => (
                  <Card key={plant._id} className="shadow-md">
                    <CardHeader>
                      <CardTitle>{plant.name}</CardTitle>
                      <CardDescription>
                        {plant.species || "No species specified"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-stone-600">
                        <strong>Location:</strong> {plant.location || "N/A"}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plant)}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(plant._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlant ? "Edit Plant" : "Add a New Plant"}
            </DialogTitle>
            <DialogDescription>
              {editingPlant
                ? "Update the details for your plant."
                : "Fill in the details for your new plant."}
            </DialogDescription>
          </DialogHeader>
          <PlantForm
            plant={editingPlant}
            onFinished={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePlantsPage;
