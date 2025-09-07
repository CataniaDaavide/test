export default function Badge({ children, className}){
    return(
        <div className={`px-4 text-sm bg-background-inverse text-background rounded-full backdrop-blur-md w-fit ${className}`}>{children}</div>
    )
}