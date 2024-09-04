import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { CldImage } from "next-cloudinary";
import { dataUrl } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Button } from "../ui/button";

type TransformedImageProps = {
  previewImage: any;
  transformationConfig: Transformations | null;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
  hasDownload?: boolean;
};

const TransformedImage = ({
  previewImage,
  transformationConfig,
  setIsSubmitting,
  hasDownload = false,
}: TransformedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Create a stable key based on all relevant properties
  const imageKey = previewImage
    ? `${previewImage.publicId}-${previewImage.width}-${previewImage.height}-${transformationConfig?.recolor?.to}-${transformationConfig?.recolor?.prompt}`
    : "";

  useEffect(() => {
    if (previewImage && transformationConfig) {
      setIsLoading(true);
    }
  }, [previewImage, transformationConfig]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setIsSubmitting && setIsSubmitting(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  // Guard clauses to ensure props are not null or undefined
  if (!previewImage || !transformationConfig) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-dark-600">Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 h-[300px]">
          <div className="w-full h-full bg-muted rounded-md flex items-center justify-center overflow-hidden">
            <p className="text-muted-foreground">
              Transformed image will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden ">
      <CardHeader>
        <CardTitle className="text-dark-600">Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-auto">
        <div className="w-full h-full mb-4 bg-muted rounded-md flex items-center justify-center overflow-hidden">
          <div className="text-muted-foreground">
            <CldImage
              key={imageKey} // Add key prop to force re-render
              alt={previewImage.title || "Transformed Image"}
              src={previewImage.publicId}
              width={previewImage.width}
              height={previewImage.height}
              sizes={"(max-width: 767px) 100vw, 50vw"}
              placeholder={dataUrl as PlaceholderValue}
              onLoad={handleImageLoad}
              onError={handleImageError}
              {...transformationConfig}
            />
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Image
              src="/assets/icons/download.svg"
              alt="Download Image"
              width={24}
              height={24}
              className="w-4 h-4 mr-2"
            />
            Download
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Image
              src="/assets/icons/save.svg"
              alt="Save Image"
              width={24}
              height={24}
              className="w-4 h-4 mr-2"
            />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransformedImage;
