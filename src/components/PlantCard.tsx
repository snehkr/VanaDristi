import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import type { Plant } from "@/types";

interface PlantCardProps {
  plant: Plant;
}

const PlantCard = ({ plant }: PlantCardProps): React.ReactElement => (
  <Card className="hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="bg-green-100/80 p-3 rounded-full">
          <Leaf className="w-8 h-8 text-green-700" />
        </div>
        <div>
          <CardTitle className="text-xl">{plant.name}</CardTitle>
          <CardDescription>
            {plant.species || "Unknown Species"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardFooter>
      <Link to={`/plant/${plant._id}`} className="w-full">
        <Button className="w-full">View Details</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default PlantCard;
