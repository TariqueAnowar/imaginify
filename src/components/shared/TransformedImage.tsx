import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Image from "next/image"; // Import the 'Image' component from the appropriate library

const TransformedImage = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-dark-600">Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-[82%]">
        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center overflow-hidden">
          <p className="text-muted-foreground">
            Transformed image will appear here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransformedImage;
