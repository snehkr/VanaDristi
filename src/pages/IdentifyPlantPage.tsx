import { useState, useRef, useCallback } from "react";
import { useApi } from "@/api/hooks";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CameraCapture from "@/components/CameraCapture";
import {
  UploadCloud,
  Camera,
  ScanSearch,
  AlertTriangle,
  X,
  Bot,
  TreePalm,
  ShieldAlert,
  BookOpen,
  HeartPulse,
  Stethoscope,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseMutationResult } from "@tanstack/react-query";
import type { IdentificationResult } from "@/types";

// A dedicated component to display the results for better organization
const IdentificationResultDisplay = ({
  mutation,
  onClear,
}: {
  mutation: UseMutationResult<IdentificationResult, Error, FormData, unknown>;
  onClear: () => void;
}) => {
  if (mutation.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-24 w-full mt-6" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (mutation.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="h-12 w-12 mb-4 text-red-500" />
        <p className="font-semibold text-red-600">Identification Failed</p>
        <p className="text-sm text-stone-600">
          Could not identify the plant. Please try another image.
        </p>
        <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (mutation.isSuccess) {
    const { data } = mutation;
    const isToxic = data.edible_or_medicinal?.toLowerCase().includes("toxic");

    return (
      <div className="space-y-4 animate-in fade-in-50">
        <div>
          <Label>Common Name</Label>
          <p className="text-2xl font-bold text-green-900">
            {data.common_name}
          </p>
        </div>
        <div>
          <Label>Scientific Name</Label>
          <p className="text-md italic text-stone-600">
            {data.scientific_name}
          </p>
        </div>

        <Alert variant={isToxic ? "destructive" : "default"} className="mt-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>{isToxic ? "Toxicity Warning" : "Edibility"}</AlertTitle>
          <AlertDescription>{data.edible_or_medicinal}</AlertDescription>
        </Alert>

        <Accordion
          type="single"
          collapsible
          defaultValue="care-summary"
          className="w-full"
        >
          <AccordionItem value="care-summary">
            <AccordionTrigger>
              <HeartPulse className="h-4 w-4 mr-2" /> Care Summary
            </AccordionTrigger>
            <AccordionContent className="text-sm text-stone-700">
              {data.care_summary}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="plant-profile">
            <AccordionTrigger>
              <BookOpen className="h-4 w-4 mr-2" /> Plant Profile
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <p>
                <strong>Family:</strong> {data.family}
              </p>
              <p>
                <strong>Origin:</strong> {data.origin}
              </p>
              <p>
                <strong>Lifespan:</strong> {data.lifespan}
              </p>
              <p>
                <strong>Growth Habit:</strong> {data.growth_habit}
              </p>
              <p>
                <strong>Flowering Season:</strong> {data.flowering_season}
              </p>
              <p>
                <strong>Fruiting Season:</strong> {data.fruiting_season}
              </p>
              <p>
                <strong>Toxicity:</strong> {data.toxicity}
              </p>
              <p>
                <strong>Primary Uses:</strong> {data.uses.join(", ")}
              </p>
              <p>
                <strong>Symbolism / Cultural Value:</strong>{" "}
                {data.symbolism_or_cultural_value}
              </p>
              <p>
                <strong>Environmental Preferences:</strong>{" "}
                {data.environmental_preferences}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="propagation">
            <AccordionTrigger>
              <TreePalm className="h-4 w-4 mr-2" /> Propagation Methods
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {data.propagation_methods.map((method, index) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="diseases">
            <AccordionTrigger>
              <Stethoscope className="h-4 w-4 mr-2" /> Common Diseases & Pests
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {data.common_diseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="similar-species">
            <AccordionTrigger>
              <BookOpen className="h-4 w-4 mr-2" /> Similar Species
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {(Array.isArray(data.similar_species)
                  ? data.similar_species
                  : [data.similar_species]
                ).map((species, index) => (
                  <li key={index}>{species}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="conservation-status">
            <AccordionTrigger>
              <AlertTriangle className="h-4 w-4 mr-2" /> Conservation Status
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">{data.conservation_status}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fun-facts">
            <AccordionTrigger>
              <Lightbulb className="h-4 w-4 mr-2" />
              Fun Facts
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">{data.fun_fact}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ai-diagnosis">
            <AccordionTrigger>
              <Bot className="h-4 w-4 mr-2" /> AI Image Diagnosis
            </AccordionTrigger>
            <AccordionContent className="text-sm text-stone-700">
              {data.diagnosis_from_image}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button variant="outline" onClick={onClear} className="w-full mt-4">
          Identify Another Plant
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-stone-500">
      <ScanSearch className="h-16 w-16 mb-4 opacity-50" />
      <p className="font-semibold">Awaiting Image</p>
      <p className="text-sm">Your identification results will appear here.</p>
    </div>
  );
};

const IdentifyPlantPage = (): React.ReactElement => {
  const { useIdentifyPlant } = useApi();
  const identifyPlant = useIdentifyPlant();
  const [, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleIdentify = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      identifyPlant.mutate(formData);
    },
    [identifyPlant]
  );

  const processFile = (file: File) => {
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      handleIdentify(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleCapture = (blob: Blob) => {
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    processFile(file);
    setIsCapturing(false);
  };

  const handleClear = () => {
    setImageFile(null);
    setPreview(null);
    identifyPlant.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-green-900">Identify a Plant</h1>
        <p className="text-stone-600 mt-1">
          Use our AI to identify a plant from a photo.
        </p>
      </div>

      <Card className="w-full">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Upload */}
          <div className="w-full lg:w-1/2 p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-stone-200">
            <CardTitle>1. Provide an Image</CardTitle>
            <div
              className={cn(
                "relative w-full h-64 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center bg-stone-50/50 transition-colors cursor-pointer",
                isDragging && "border-green-700 bg-green-50/50"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Plant preview"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center text-stone-500 p-4">
                  <UploadCloud className="mx-auto h-12 w-12" />
                  <p className="mt-2 font-semibold">
                    Drag & drop an image or click to upload
                  </p>
                  <p className="text-xs mt-1">PNG, JPG, or JPEG accepted</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-stone-200"></div>
              <span className="text-xs text-stone-500">OR</span>
              <div className="flex-1 border-t border-stone-200"></div>
            </div>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setIsCapturing(true)}
            >
              <Camera className="mr-2 h-4 w-4" /> Use Camera
            </Button>
          </div>
          {/* Right Side: Results */}
          <div className="w-full lg:w-1/2 p-6">
            <CardTitle className="mb-4">2. Identification Results</CardTitle>
            <IdentificationResultDisplay
              mutation={identifyPlant}
              onClear={handleClear}
            />
          </div>
        </div>
      </Card>
      {isCapturing && (
        <CameraCapture
          onCapture={handleCapture}
          onCancel={() => setIsCapturing(false)}
        />
      )}
    </div>
  );
};

export default IdentifyPlantPage;
