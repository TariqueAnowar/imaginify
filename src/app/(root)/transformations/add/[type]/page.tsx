import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constant";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AddTransformationsTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const transformationObject = transformationTypes[type];

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  //const user = await getUserById(userId);

  return (
    <>
      <Header
        title={transformationObject.title}
        subtitle={transformationObject.subTitle}
      />

      <section className="mt-10">
        <TransformationForm
          data={null}
          action="Add"
          userId={""}
          type={transformationObject.type as TransformationTypeKey}
          creditBalance={0}
          config={null}
        />
      </section>
    </>
  );
};

export default AddTransformationsTypePage;
