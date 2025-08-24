//componente che serve per mettere il titolo sopra gli input e i vari componenti 
//che hanno valori richiesti e che hanno un titolo
export default function TitleComponents({ title, required }) {
  return (
    <>
      {title && (
        <p className="text-xs font-medium mb-1">
          {title}
          {required && <span className="text-red-500"> *</span>}
        </p>
      )}
    </>
  );
}