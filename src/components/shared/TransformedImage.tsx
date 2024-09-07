"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { dataUrl } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Button } from "../ui/button";
import { download } from "@/lib/utils";
import { addImage } from "@/lib/actions/image.actions";

type TransformedImageProps = {
  previewImage: any;
  transformationConfig: Transformations | null;
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>;
  hasDownload?: boolean;
  userId: string;
};

const TransformedImage = ({
  previewImage,
  transformationConfig,
  setIsSubmitting,
  hasDownload = false,
  userId,
}: TransformedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Create a stable key based on all relevant properties
  const imageKey = previewImage
    ? `${previewImage.publicId}-${previewImage.width}-${previewImage.height}-${transformationConfig?.recolor?.to}-${transformationConfig?.recolor?.prompt}-${transformationConfig?.remove?.prompt}`
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

  const handleDownload = () => {
    // Get the transformed image URL
    const transformedUrl = getCldImageUrl({
      width: previewImage.width,
      height: previewImage.height,
      src: previewImage.publicId,
      ...transformationConfig,
    });

    console.log("Transformed URL:", transformedUrl);
    download(transformedUrl, previewImage.title || "transformed_image");
  };

  const handleSave = async () => {
    if (isSaved) return;

    setIsSaved(true);

    // Get the transformed image URL
    const transformedUrl = getCldImageUrl({
      width: previewImage.width,
      height: previewImage.height,
      src: previewImage.publicId,
      ...transformationConfig,
    });

    const imageData = {
      title: previewImage.title || "Transformed Image",
      publicId: previewImage.publicId,
      secureURL: transformedUrl,
      width: previewImage.width,
      height: previewImage.height,
      aspectRatio: previewImage.aspectRatio,
      transformationType: previewImage.transformationType,
      config: transformationConfig,
      prompt:
        transformationConfig?.recolor?.prompt ||
        transformationConfig?.remove?.prompt,
      color: transformationConfig?.recolor?.to,
    };

    try {
      const newImage = await addImage({
        image: imageData,
        userId: userId,
      });
    } catch (error) {
      console.error("Error saving image:", error);
      setIsSaved(false);
    }
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
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-dark-600">Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-auto">
        <div className="w-full h-full mb-4 bg-muted rounded-md flex items-center justify-center overflow-hidden">
          <div className="text-muted-foreground relative">
            <CldImage
              key={imageKey}
              alt={previewImage.title || "Transformed Image"}
              src={previewImage.publicId}
              width={previewImage.width}
              height={previewImage.height}
              sizes={"(max-width: 767px) 100vw, 50vw"}
              placeholder={dataUrl as PlaceholderValue}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="rounded-md"
              {...transformationConfig}
            />

            <Button
              className="absolute top-2 right-2 z-10 bg-white text-black hover:bg-gray-200"
              type="button"
              size="sm"
              onClick={() => setIsZoomed(true)}
            >
              <Image
                src="/assets/icons/fullscreen.svg"
                alt="Zoom"
                width={20}
                height={20}
                className="mr-2"
              />
              Zoom
            </Button>
            {isZoomed && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="relative bg-white rounded-lg shadow-xl p-4 w-full max-w-[90vw] h-full max-h-[90vh] flex flex-col">
                  <div className="flex-grow overflow-auto">
                    <CldImage
                      key={`${imageKey}-large`}
                      alt={previewImage.title || "Transformed Image (Large)"}
                      src={previewImage.publicId}
                      width={previewImage.width}
                      height={previewImage.height}
                      className="object-contain w-full h-full"
                      placeholder={dataUrl as PlaceholderValue}
                      {...transformationConfig}
                    />
                  </div>
                  <Button
                    className="absolute top-2 right-2 bg-white text-black hover:bg-gray-200"
                    type="button"
                    size="sm"
                    onClick={() => setIsZoomed(false)}
                  >
                    <Image
                      src="/assets/icons/close.svg"
                      alt="Close"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
            onClick={handleDownload}
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
            disabled={isLoading || isSaved}
            onClick={handleSave}
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
