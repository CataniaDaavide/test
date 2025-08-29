import { X } from "lucide-react";
import {
    CardContent,
    CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderActions,
  CardHeaderContent,
  CardTitle,
} from "../card";
import { Button, ButtonIcon } from "../button";

export default function ModalError({ data, handleCloseModal }) {
  const { title, description, message } = data;
  return (
    <>
      <CardHeader>
        <CardHeaderContent>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeaderContent>
      </CardHeader>

      <CardContent className="overflow-scroll scrollbar-hide">
        {message && <p>{message}</p>}
      </CardContent>

      <CardFooter className={"md:mt-3"}>
        <Button onClick={handleCloseModal}><span>Chiudi</span></Button>
      </CardFooter>
    </>
  );
}
