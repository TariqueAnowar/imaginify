"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { IImage } from "@/lib/database/models/image.model";
import CustomField from "./CustomField";
import { aspectRatioOptions, creditFee, transformationTypes } from "@/constant";
import {
  AspectRatioKey,
  debounce,
  deepMergeObjects,
  deepEqual,
} from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { Eraser, Save } from "lucide-react";

type TransformationFormProps = {
  action: "Add" | "Update";
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  data?: IImage | null;
  config?: Transformations | null;
};

export const formSchema = z
  .object({
    title: z.string(),
    aspectRatio: z.string().optional(),
    type: z.string().min(1, "Type is required"), // Hidden field
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string().min(1, "Choose Your Image").optional().nullable(),
  })
  .superRefine((data, context) => {
    if (data.type === "fillBackground" && !data.aspectRatio) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["aspectRatio"],
        message: "Choose Your Preferred Aspect Ratio",
      });
    }

    if ((data.type === "remove" || data.type === "recolor") && !data.prompt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["prompt"],
        message: "Provide an Object Name",
      });
    }

    if (data.type === "recolor" && !data.color) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["color"],
        message: "Provide a Replacement Color",
      });
    }
  });

const TransformationForm = ({
  data = null,
  action,
  type,
  userId,
  config = null,
  creditBalance,
}: TransformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalImage, setOriginalImage] = useState(data);
  const [previewImage, setPreviewImage] = useState<IImage | null>(null);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, startTransition] = useTransition();

  const [previousValues, setPreviousValues] = useState<z.infer<
    typeof formSchema
  > | null>(null);

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
          type: type,
        }
      : {
          title: "",
          aspectRatio: "",
          color: "",
          prompt: "",
          publicId: "",
          type: type,
        };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    //console.log("TransformationForm Form onSubmit values:", values);

    const isSame = deepEqual(previousValues, values);

    if (isSame) {
      //console.log("Values are the same as previous values. Skipping...");
      return;
    }

    setIsSubmitting(true);

    if (values.type === "fillBackground") {
      const imageSize =
        aspectRatioOptions[values.aspectRatio as AspectRatioKey];

      setPreviewImage((prevState: any) => ({
        ...prevState,
        width: imageSize.width,
        height: imageSize.height,
        aspectRatio: values.aspectRatio,
        publicId: values.publicId,
      }));
    } else {
      setPreviewImage((prevState: any) => ({
        ...prevState,
        width: originalImage?.width,
        height: originalImage?.height,
        aspectRatio: values.aspectRatio,
        publicId: values.publicId,
      }));
    }

    /*
    setTransformationConfig(transformationObject.config);

    setTransformationConfig((prevState: any) => ({
      ...prevState,
      [type]: {
        ["prompt"]: values.prompt,
        ["to"]: values.color,
      },
    }));
    */

    setTransformationConfig((prevState: any) => ({
      ...prevState,
      [type]:
        type === "fillBackground" ||
        type === "removeBackground" ||
        type === "restore"
          ? true
          : { prompt: values.prompt, to: values.color },
    }));

    setPreviousValues(values);
    return;

    // startTransition(async () => {
    //   await updateCredits(userId, creditFee);
    // });
  }

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    return onChangeField(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Hidden type field */}
        <input type="hidden" {...form.register("type")} />

        <CustomField
          control={form.control}
          name="title"
          // formLabel="Image Title"
          className="w-full"
          render={({ field }) => (
            <Input {...field} placeholder="Image Title" className="w-full" />
          )}
        />

        {type === "fillBackground" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            // formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
              >
                <SelectTrigger className="select-filed">
                  <SelectValue placeholder="Preferred Image Size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key}>
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <CustomField
            control={form.control}
            name="prompt"
            // formLabel={
            //   type === "remove" ? "Object to Remove" : "Object to Recolor"
            // }
            className="w-full"
            render={({ field }) => (
              <Input
                {...field}
                placeholder={
                  type === "remove" ? "Object to Remove" : "Object to Recolor"
                }
                className=""
              />
            )}
          />
        )}

        {type === "recolor" && (
          <CustomField
            control={form.control}
            name="color"
            //formLabel="Replacement Color"
            className="w-full"
            render={({ field }) => (
              <Input {...field} placeholder="Replacement Color" className="" />
            )}
          />
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                originalImage={originalImage}
                onValueChange={field.onChange}
                setOriginalImage={setOriginalImage}
                publicId={field.value}
                type={type}
              />
            )}
          />

          <TransformedImage
            previewImage={previewImage}
            setIsSubmitting={setIsSubmitting}
            transformationConfig={transformationConfig}
          />
        </div>
        <div className="flex flex-col gap-4">
          {/* <Button
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTransformaton === null}
            onClick={onTransformationHandler}
          >
            <Save className="w-4 h-4 mr-2" />
            {isTransforming ? "Transforming..." : "Apply Transformation"}
          </Button> */}

          <Button
            type="submit"
            className="capitalize  bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isSubmitting}
          >
            <Eraser className="w-4 h-4 mr-2" />
            {isSubmitting ? "Transforming..." : "Apply Transformation"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
