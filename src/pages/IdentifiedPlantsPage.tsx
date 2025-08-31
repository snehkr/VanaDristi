import { useApi } from "@/api/hooks";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Bot,
  HeartPulse,
  History,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import type { IdentificationResult } from "@/types";

// A dedicated card component for each identified plant
const IdentifiedPlantCard = ({ plant }: { plant: IdentificationResult }) => {
  const isToxic = plant.edible_or_medicinal?.toLowerCase().includes("toxic");

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <img
          src={plant.image_url}
          alt={plant.common_name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl text-green-900">
          {plant.common_name}
        </CardTitle>
        <CardDescription className="italic">
          {plant.scientific_name}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">View Details</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {plant.common_name}
              </DialogTitle>
              <p className="text-md italic text-stone-600 pt-1">
                {plant.scientific_name}
              </p>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Alert variant={isToxic ? "destructive" : "default"}>
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>
                  {isToxic ? "Toxicity Warning" : "Edibility"}
                </AlertTitle>
                <AlertDescription>{plant.edible_or_medicinal}</AlertDescription>
              </Alert>
              <Accordion
                type="single"
                collapsible
                defaultValue="care-summary"
                className="w-full"
              >
                <AccordionItem value="care-summary">
                  <AccordionTrigger>
                    <HeartPulse className="h-4 w-4 mr-2" />
                    Care Summary
                  </AccordionTrigger>
                  <AccordionContent>{plant.care_summary}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="plant-profile">
                  <AccordionTrigger>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Plant Profile
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <p>
                      <strong>Family:</strong> {plant.family}
                    </p>
                    <p>
                      <strong>Origin:</strong> {plant.origin}
                    </p>
                    <p>
                      <strong>Growth Habit:</strong> {plant.growth_habit}
                    </p>
                    <p>
                      <strong>Flowering Season:</strong>{" "}
                      {plant.flowering_season}
                    </p>
                    <p>
                      <strong>Primary Uses:</strong> {plant.uses.join(", ")}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="diseases">
                  <AccordionTrigger>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Common Diseases & Pests
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      {plant.common_diseases.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ai-diagnosis">
                  <AccordionTrigger>
                    <Bot className="h-4 w-4 mr-2" />
                    AI Image Diagnosis
                  </AccordionTrigger>
                  <AccordionContent>
                    {plant.diagnosis_from_image}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const IdentifiedPlantsPage = (): React.ReactElement => {
  const { useGetIdentifications } = useApi();
  const { data: identifications, isLoading } = useGetIdentifications();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-green-900">
          Identification History
        </h1>
        <p className="text-stone-600 mt-1">
          A collection of all the plants you have identified.
        </p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : !identifications || identifications.length === 0 ? (
        <div className="text-center p-8 md:p-16 bg-stone-50 rounded-lg border-2 border-dashed">
          <History className="mx-auto h-16 w-16 text-green-700 opacity-50" />
          <h3 className="mt-4 text-xl font-semibold text-stone-800">
            No History Found
          </h3>
          <p className="mt-2 text-sm text-stone-500">
            You haven't identified any plants yet. Go to the "Identify" page to
            start.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {identifications.map((plant) => (
            <IdentifiedPlantCard key={plant.image_url} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IdentifiedPlantsPage;
