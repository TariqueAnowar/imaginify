import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { CldImage } from "next-cloudinary";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

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
  const [previousPreviewImage, setPreviousPreviewImage] = useState(null);

  useEffect(() => {
    if (previousPreviewImage) {
      const isSame = deepEqual(previousPreviewImage, previewImage);

      if (isSame && setIsSubmitting) {
        setIsSubmitting(false);
      }
      //console.log("Are the previewImage objects the same?", isSame);
    }
    setPreviousPreviewImage(previewImage);
  }, [previewImage]);

  const deepEqual = (obj1: any, obj2: any) => {
    if (obj1 === obj2) return true;

    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-dark-600">Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-[82%]">
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center overflow-hidden">
          <div className="text-muted-foreground">
            {previewImage?.publicId && transformationConfig ? (
              <CldImage
                key={
                  previewImage.publicId |
                  previewImage.width |
                  previewImage.height
                } // Add key prop to force re-render
                alt={previewImage.title}
                src={previewImage.publicId}
                width={previewImage.width}
                height={previewImage.height}
                sizes={"(max-width: 767px) 100vw, 50vw"}
                placeholder={dataUrl as PlaceholderValue}
                onLoad={() => {
                  setIsSubmitting && setIsSubmitting(false);
                }}
                onError={() => {}}
                {...transformationConfig}
              />
            ) : (
              <p className="text-muted-foreground">
                Transformed image will appear here
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransformedImage;
