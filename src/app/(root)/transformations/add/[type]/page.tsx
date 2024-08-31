import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constant";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { use } from "react";

const AddTransformationsTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const transformationObject = transformationTypes[type];

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const user = await getUserById(userId);
  //console.log(userId);

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
          userId={user._id}
          type={transformationObject.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
          config={null}
        />
      </section>
    </>
  );
};

export default AddTransformationsTypePage;
