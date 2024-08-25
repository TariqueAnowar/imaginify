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
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
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

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({
  data = null,
  action,
  type,
  userId,
  config,
  creditBalance,
}: TransformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [newTransformaton, setNewTransformation] =
    useState<Transformations | null>(null);
  const [image, setImage] = useState(data);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, startTransition] = useTransition();

  const transformationType = transformationTypes[type];

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : {
          title: "",
          aspectRatio: "",
          color: "",
          prompt: "",
          publicId: "",
        };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  // FIXME: Need to understand the code
  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));

    setNewTransformation(transformationType.config);
    return onChangeField(value);
  };

  // FIXME: Need to understand the code
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
    }, 1000)();

    return onChangeField(value);
  };

  // TODO: Return to update credit fee
  const onTransformationHandler = () => {
    setIsTransforming(true);

    setTransformationConfig(
      deepMergeObjects(newTransformaton, transformationConfig)
    );

    setNewTransformation(null);

    startTransition(async () => {
      /*
      await updateCredits(userId, creditFee);
      */
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
              >
                <SelectTrigger className="select-filed">
                  <SelectValue placeholder="Select size" />
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
            formLabel={
              type === "remove" ? "Object to Remove" : "Object to Recolor"
            }
            className="w-full"
            render={({ field }) => (
              <Input
                value={field.value}
                className="input-field"
                onChange={(e) =>
                  onInputChangeHandler(
                    "prompt",
                    e.target.value,
                    type,
                    field.onChange
                  )
                }
              />
            )}
          />
        )}

        {type === "recolor" && (
          <CustomField
            control={form.control}
            name="color"
            formLabel="Replacement Color"
            className="w-full"
            render={({ field }) => (
              <Input
                value={field.value}
                className="input-field"
                onChange={(e) =>
                  onInputChangeHandler(
                    "color",
                    e.target.value,
                    "recolor",
                    field.onChange
                  )
                }
              />
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
                image={image}
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                type={type}
              />
            )}
          />

          <TransformedImage />
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTransformaton === null}
            onClick={onTransformationHandler}
          >
            <Eraser className="w-4 h-4 mr-2" />
            {isTransforming ? "Transforming..." : "Apply Transformation"}
          </Button>

          <Button
            type="submit"
            className="submit-button capitalize  bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
