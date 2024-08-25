"use client";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  type: string;
  image: any;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  publicId,
  type,
  image,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSucceshandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result.info.public_id,
      width: result.info.width,
      height: result.info.height,
      secureUrl: result.info.secure_url,
    }));

    onValueChange(result.info.public_id);

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
              className={`p-6 pt-0 flex flex-col h-[${
                image ? getImageSize(type, image, "height") : 300
              }px]`}
            >
              <div className="flex-grow flex items-center justify-center mb-4 bg-muted rounded-md overflow-hidden">
                {publicId && (
                  <CldImage
                    key={publicId} // Add key prop to force re-render
                    src={publicId}
                    alt="image"
                    width={getImageSize(type, image, "width")}
                    height={getImageSize(type, image, "height")}
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
