import { Sidebar } from "./sidebar";

export function Menu() {
  return (
    <>
    <div className="flex md:hidden">
      <Sidebar />
    </div>
    </>
  );
}


// function MenuMobile(){
//   return(
//     <div className="absolute top-2 left-1/2 bg-card border border-border-card h-10 w-full rounded-lg"></div>
//   )
// }