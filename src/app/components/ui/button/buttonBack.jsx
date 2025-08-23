"use client";

import { useRouter } from "next/navigation";

//icons
import { ChevronLeft } from "lucide-react";
import { ButtonIcon } from "./buttonIcon";

export default function ButtonBack({ className }) {
  const router = useRouter();

  return (
    <div className={className}>
      <ButtonIcon
        fn={() => {
          router.back();
        }}
        icon={<ChevronLeft />}
        // color={"trasparent"}
        className={"!rounded-full"}
      />
    </div>
  );
}
