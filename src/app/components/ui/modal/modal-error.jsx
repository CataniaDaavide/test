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
        
        <CardHeaderActions className={"absolute top-3 right-3"}>
            <ButtonIcon onClick={handleCloseModal} icon={<X />} className={`hover:!bg-transparent !text-muted-foreground hover:!text-background-inverse transition-all duration-300`} color={"trasparent"}/>
        </CardHeaderActions>
      </CardHeader>

      <CardContent>
        {message && <p>{message}</p>}
      </CardContent>

      <CardFooter className={"md:mt-3"}>
        <Button onClick={handleCloseModal}><span>Chiudi</span></Button>
      </CardFooter>
    </>
  );
}
