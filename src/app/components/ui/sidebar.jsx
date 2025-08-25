// "use client";
// import { useRouter } from "next/navigation";
// import { useContext, useState } from "react";
// import { Wallet } from "lucide-react";
// import { SidebarContext } from "@/app/context/SidebarContext";
"use client"
import { SidebarContext } from "@/app/context/SidebarContext"
import { useContext, useEffect } from "react"
// export default function Sidebar({ data }) {
//   const router = useRouter();

//   const [ activeTab, setActiveTab ] = useContext(SidebarContext);
//   const [expand, setExpand] = useState(true);

//   const toggleSidebar = () => {
//     try {
//       setExpand(!expand);
//     } catch (error) {
//       base_exceptionManager(error);
//     }
//   };

//   return (
//     <div className="w-full h-full flex">
//       <div
//         className={`${
//           expand ? "w-[300px]" : "w-[60px]"
//         } transition-all px-3 border h-full bg-card border-border-card flex gap-3 flex-col items-center`}
//       >
//         <div className="flex items-center justify-center h-14 w-full font-bold">
//           <Wallet size={28} />
//           <span className={expand ? "ml-2 w-auto" : "w-0 overflow-hidden"}>
//             Expense Tracker
//           </span>
//         </div>
//         <ul className="w-full flex flex-col gap-1 items-center">
//           {data.map((t, index) => {
//             const { title, icon, link } = t;
//             return (
//               <li
//                 key={index}
//                 title={title}
//                 // onClick={() => setActiveTab(tabs[index])}
//                 onClick={() => {
//                   setActiveTab(data[index])
//                   router.push(link);
//                 }}
//                 className={`rounded-md flex items-center cursor-pointer
//                   ${
//                     expand
//                       ? "w-full h-10 text-sm font-bold px-4 py-2"
//                       : "h-10 w-10 justify-center"
//                   } ${
//                   activeTab.title === title
//                     ? "bg-background-inverse text-white dark:text-black"
//                     : "dark:text-white text-black hover:bg-background-inverse/10"
//                 }`}
//               >
//                 {icon}
//                 <span
//                   className={expand ? "ml-1 w-full" : "w-0 overflow-hidden"}
//                 >
//                   {title}
//                 </span>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//       {/* <NavbarSidebar toggleSidebar={toggleSidebar} children={children} /> */}
//     </div>
//   );
// }

// // function NavbarSidebar({ toggleSidebar, children }) {
// //   return (
// //     <div className="w-full h-full">
// //       <div className="w-full h-full flex flex-col">
// //         <div className="h-14 w-full bg-card border border-x-0 border-border-card flex gap-3 items-center px-4">
// //           <button
// //             onClick={toggleSidebar}
// //             className="w-6 h-6 flex items-center justify-center"
// //           >
// //             <PanelLeft size={20} />
// //           </button>
// //           <span className="text-lg font-medium">Dashboard</span>
// //         </div>
// //         <ButtonLogout />
// //       </div>
// //       {children}
// //     </div>
// //   );
// // }


export default function Sidebar({ data }) {
  const { activeTab, setActiveTab } = useContext(SidebarContext)
  
  useEffect(()=>{
    setActiveTab(data[0])
  },[])

  return(
    <div className="bg-red-500 w-32 h-full border"></div>
  )
}