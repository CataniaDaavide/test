export function Button({ title, onClick }){
    return(
        <button className="px-3 py-2 h-10 font-medium text-sm border rounded-md bg-zinc-950 dark:bg-zinc-100 text-white dark:text-black w-full cursor-pointer" onClick={onClick}>{title}</button>
    )
}