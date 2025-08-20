export function InputBase({
  title,
  name = "",
  type = "text",
  placeholder = "",
  ref,
}) {
  return (
    <div className="w-full flex flex-col gap-1">
      {title && <p>{title}</p>}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        ref={ref}
        className="bg-zinc-900 border-2 border-zinc-800 text-sm"
      />
    </div>
  );
}

export function InputPassword({
  title,
  name = "",
  placeholder = "",
  data,
  setData,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(value);

    //la versione sotto serve per data che hanno più proprietà
    // setData(
    //     {
    //         ...data,
    //         name: value,
    //     }
    // )
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {title && <p>{title}</p>}
      <input
        name={name}
        type={"password"}
        placeholder={placeholder}
        onChange={handleChange}
        className="bg-zinc-900 border-2 border-zinc-800 text-sm"
      />
    </div>
  );
}
