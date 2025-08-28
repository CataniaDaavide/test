//componente che serve per mettere il titolo sopra gli input e i vari componenti

import { Asterisk } from "lucide-react";

//che hanno valori richiesti e che hanno un titolo
export default function TitleComponents({ title, required }) {
  return (
    <>
      <div className="flex gap-1 items-center mb-1">
        {title && <p className="text-sm font-medium">{title}</p>}
        {required && <Asterisk size={12} className="text-red-500"> *</Asterisk>}
      </div>
    </>
  );
}
