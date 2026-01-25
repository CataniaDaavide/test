import { Home, Folder, ArrowUpDown, CreditCard, Plus, UserRound } from "lucide-react";

export const menuItems = [
    {
        title: "Dashboard",
        description: "Panoramica delle tue finanze personali",
        icon: Home,
        link: "/",
        menu: ["mobile", "desktop"],
    },
    {
        title: "Categorie",
        description: "Gestisci le categorie per entrate e uscite",
        icon: Folder,
        link: "/categories",
        menu: ["mobile", "desktop"],
    },
    {
        title: "add movement",
        icon: Plus,
        action: async (setLoader) => {
            setLoader(true)
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoader(false)
        },
        menu: ["mobile"],
    },
    {
        title: "Movimenti",
        description: "Gestisci tutte le tue entrate e uscite",
        icon: ArrowUpDown,
        link: "/movements",
        menu: ["mobile", "desktop"],
    },
    {
        title: "Conti",
        description: "Gestisci le tue fonti di denaro",
        icon: CreditCard,
        link: "/accounts",
        menu: ["mobile", "desktop"],
    },
    {
        title: "Profilo",
        description: "Gestisci i tuoi obiettivi di risparmio",
        icon: UserRound,
        link: "/profile",
        menu: ["desktop"],
    },
];