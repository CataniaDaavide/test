import { TriangleAlert, X } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardTitle,
} from "../card";
import { Button, ButtonIcon } from "../button";
import React from "react";

export default function ModalAlert({ data, handleCloseModal }) {
  const { title = "undefined", description = "", icon = undefined, message = "", buttons = [] } = data;
  return (
    <>
      <CardHeader className="!w-full !flex-col gap-1 !items-center">
        {icon}
        <CardHeaderContent className="!items-center">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="!max-h-[300px] overflow-y-scroll">
        {message}
      </CardContent>

      <CardFooter className={"md:mt-3"}>
        {buttons.map((button, index) => {
          if (button === "close") {
            return (
              <Button key={index} onClick={handleCloseModal}>
                <span>Chiudi</span>
              </Button>
            );
          }

          if (React.isValidElement(button)) {
            return React.cloneElement(button, { key: index });
          }
        })}
      </CardFooter>
    </>
  );
}
