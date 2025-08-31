import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
}

const CameraCapture = ({
  onCapture,
  onCancel,
}: CameraCaptureProps): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function getCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert(
          "Could not access camera. Please ensure you have given permission."
        );
        onCancel();
      }
    }
    getCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onCancel]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob(
          (blob) => {
            if (blob) onCapture(blob);
          },
          "image/jpeg",
          0.9
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-2xl h-auto rounded-lg mb-4"
      ></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="flex space-x-4">
        <Button onClick={handleCapture} size="lg">
          Take Picture
        </Button>
        <Button onClick={onCancel} variant="secondary" size="lg">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;
