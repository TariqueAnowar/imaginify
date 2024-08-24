import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { CldUploadWidget } from "next-cloudinary";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  publicId,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSucceshandler = () => {
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
    ></CldUploadWidget>
  );
};

export default MediaUploader;
