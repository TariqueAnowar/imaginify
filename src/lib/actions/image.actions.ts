"use server";
import { revalidatePath } from "next/cache";
import Image from "../database/models/image.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

type AddImageParams = {
  image: {
    title: string;
    publicId: string;
    width: number;
    height: number;
    transformationType: string;
    config: any;
    secureURL: string;
    aspectRatio: string | undefined;
    prompt: string | undefined;
    color: string | undefined;
  };
  userId: string;
};

export async function addImage({ image, userId }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);

    if (!author) {
      throw new Error("Author not found");
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });
    //revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    console.error("Error in addImage:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
