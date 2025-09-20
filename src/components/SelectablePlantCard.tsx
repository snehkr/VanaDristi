import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Leaf, CheckCircle2, XCircle } from "lucide-react";
import type { Plant } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SelectablePlantCardProps {
  plant: Plant;
  isCurrent: boolean;
  isSelected: boolean;
  onSelect: (plantId: string) => void;
  onRemove: () => void;
}

const SelectablePlantCard = ({
  plant,
  isCurrent,
  isSelected,
  onSelect,
  onRemove,
}: SelectablePlantCardProps): React.ReactElement => (
  <Card
    className={cn(
      "cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative",
      isCurrent && "ring-2 ring-green-700 border-green-700",
      isSelected && !isCurrent && "ring-2 ring-blue-500 border-blue-500"
    )}
    onClick={() => onSelect(plant._id)}
  >
    {isCurrent && (
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <div className="bg-green-700 text-white rounded-full p-1">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-red-500/80 text-white rounded-full hover:bg-red-600/90"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <XCircle className="w-5 h-5" />
        </Button>
      </div>
    )}
    <CardHeader>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-3 rounded-full",
            isCurrent || isSelected ? "bg-green-100/80" : "bg-stone-100/80"
          )}
        >
          <Leaf
            className={cn(
              "w-8 h-8",
              isCurrent || isSelected ? "text-green-700" : "text-stone-600"
            )}
          />
        </div>
        <div>
          <CardTitle className="text-xl">{plant.name}</CardTitle>
          <CardDescription>
            {plant.species || "Unknown Species"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  </Card>
);

export default SelectablePlantCard;
