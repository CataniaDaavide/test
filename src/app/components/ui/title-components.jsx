//componente che serve per mettere il titolo sopra gli input e i vari componenti

import { Asterisk } from "lucide-react";

//che hanno valori richiesti e che hanno un titolo
export default function TitleComponents({ children, required, className }) {
  return (
    <>
      {children && <div className={`flex gap-1 items-center mb-1 ${className}`}>
        {children && <p className="text-sm font-medium">{children}</p>}
        {required && <Asterisk size={12} className="text-red-500"> *</Asterisk>}
      </div>}
    </>
  );
}
