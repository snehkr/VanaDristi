import { useState } from "react";
import { useApi } from "../api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Plant } from "@/types";

interface PlantFormProps {
  plant?: Plant | null;
  onFinished: () => void;
}

const PlantForm = ({
  plant,
  onFinished,
}: PlantFormProps): React.ReactElement => {
  const { useCreatePlant, useUpdatePlant } = useApi();
  const createPlant = useCreatePlant();
  const updatePlant = useUpdatePlant();
  const [formData, setFormData] = useState({
    name: plant?.name || "",
    species: plant?.species || "",
    location: plant?.location || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (plant) {
      updatePlant.mutate(
        { plantId: plant._id, updatedPlant: formData },
        {
          onSuccess: onFinished,
        }
      );
    } else {
      createPlant.mutate(formData, {
        onSuccess: onFinished,
      });
    }
  };

  const isLoading = createPlant.isPending || updatePlant.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plant Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Living Room Fiddle Leaf"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="species">Species (Optional)</Label>
        <Input
          id="species"
          name="species"
          value={formData.species}
          onChange={handleChange}
          placeholder="e.g., Ficus lyrata"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., By the window"
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {plant ? "Save Changes" : "Create Plant"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PlantForm;
