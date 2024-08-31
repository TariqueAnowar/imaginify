"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { dataUrl } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setOriginalImage: React.Dispatch<any>;
  publicId: string;
  type: string;
  originalImage: any;
};

const MediaUploader = ({
  onValueChange,
  setOriginalImage,
  publicId,
  type,
  originalImage,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const [loaderDimensions, setLoaderDimensions] = useState({
    width: 458,
    height: 300,
  });

  const onUploadSucceshandler = (result: any) => {
    const { public_id, width, height, secure_url } = result.info;

    setLoaderDimensions({ width, height });

    setOriginalImage((prevState: any) => ({
      ...prevState,
      publicId: public_id,
      width: width,
      height: height,
      secureUrl: secure_url,
    }));

    onValueChange(public_id);

    toast({
      title: "Image uploaded successfully",
      description: "1 credit deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  };

  const onUploadErrorhandler = () => {
    toast({
      title: "Something went wrong",
      description: "Please try again",
      duration: 5000,
      className: "error-toast",
    });
  };

  useEffect(() => {
    loaderDimensions;
  }, [loaderDimensions]);

  return (
    <CldUploadWidget
      uploadPreset="imaginify"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSucceshandler}
      onError={onUploadErrorhandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          {/* <h3 className="h3-bold text-dark-600">Original</h3> */}

          <Card className="overflow-hidden border-2 border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className=" text-dark-600">Original</CardTitle>
            </CardHeader>
            <CardContent
              className={`p-6 pt-0 flex flex-col h-[${loaderDimensions.height}px]`}
            >
              <div className="flex-grow flex items-center justify-center mb-4 bg-muted rounded-md overflow-hidden">
                {publicId && (
                  <CldImage
                    key={publicId} // Add key prop to force re-render
                    src={publicId}
                    alt="image"
                    width={loaderDimensions.width}
                    height={loaderDimensions.height}
                    sizes={"(max-width: 767px) 100vw, 50vw"}
                    placeholder={dataUrl as PlaceholderValue}
                  />
                )}
                {!publicId && (
                  <Image
                    src="/assets/icons/image-placeholder.svg"
                    alt="Add Image"
                    width={24}
                    height={24}
                    className="w-12 h-12 text-muted-foreground opacity-50"
                  />
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => open()}
                >
                  <Image
                    src="/assets/icons/upload.svg"
                    alt="Add Image"
                    width={24}
                    height={24}
                    className="w-4 h-4 mr-2"
                  />
                  {publicId ? "Change Image" : "Upload Image"}
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* {publicId ? (
            <>
              <CldImage
                src={publicId}
                alt="image"
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                sizes={"(max-width: 767px) 100vw, 50vw"}
                placeholder={dataUrl as PlaceholderValue}
              />
            </>
          ) : (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="h3-bold text-dark-600">
                  Original
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col h-[300px]">
                <div className="flex-grow flex items-center justify-center mb-4 bg-muted rounded-md overflow-hidden">
                  <Image
                    src="/assets/icons/image-placeholder.svg"
                    alt="Add Image"
                    width={24}
                    height={24}
                    className="w-12 h-12 text-muted-foreground opacity-50"
                  />
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => open()}
                  >
                    <Image
                      src="/assets/icons/upload.svg"
                      alt="Add Image"
                      width={24}
                      height={24}
                      className="w-4 h-4 mr-2"
                    />
                    {publicId ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )} */}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
