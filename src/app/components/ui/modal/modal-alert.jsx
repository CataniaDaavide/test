import { CardContent, CardDescription, CardFooter, CardHeader, CardHeaderContent, CardTitle } from "../card";
import { Button } from "../button";
import React from "react";
import { useRouter } from "next/navigation";

export default function ModalAlert({ data, handleCloseModal }) {
  const router = useRouter()
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

      <CardContent className="min-h-[100px] !max-h-[300px] overflow-y-scroll">{message}</CardContent>

      <CardFooter className={"md:mt-3"}>
        {buttons.map((button, index) => {
          if (button === "close" || button === "cancel") {
            return (
              <Button key={index} onClick={handleCloseModal}>
                <span>{button === "close" ? "Chiudi" : "Annulla"}</span>
              </Button>
            );
          }

          if (button === "close" || button === "cancel") {
            return (
              <Button key={index} onClick={handleCloseModal}>
                <span>{button === "close" ? "Chiudi" : "Annulla"}</span>
              </Button>
            );
          }

          if (button === "login") {
            return (
              <Button key={index} onClick={() => {router.push("/login"); handleCloseModal()}}>
                <span>Login</span>
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
