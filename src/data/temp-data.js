import { Home, Folder, ArrowUpDown, CreditCard, Plus, UserRound, ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from "lucide-react";

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
    action: (setDialog) => {
      setDialog({
        show: true,
        type: "movement",
        data: {},
      })
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

export const mockupCategories = [
  // ===== INCOME =====
  {
    id: "c1",
    userId: "u1",
    name: "Stipendio",
    emoji: "💼",
    type: "income",
    hexColor: "#4CAF50",
    status: "active",
  },
  {
    id: "c2",
    userId: "u1",
    name: "Freelance",
    emoji: "🧑‍💻",
    type: "income",
    hexColor: "#00C2FF",
    status: "active",
  },
  {
    id: "c3",
    userId: "u1",
    name: "Investimenti",
    emoji: "📈",
    type: "income",
    hexColor: "#8E44AD",
    status: "active",
  },
  {
    id: "c4",
    userId: "u1",
    name: "Regali",
    emoji: "🎁",
    type: "income",
    hexColor: "#F368E0",
    status: "active",
  },

  // ===== EXPENSE =====
  {
    id: "c5",
    userId: "u1",
    name: "Cibo",
    emoji: "🍔",
    type: "expense",
    hexColor: "#FF7A5A",
    status: "active",
  },
  {
    id: "c6",
    userId: "u1",
    name: "Abbonamenti",
    emoji: "🔗",
    type: "expense",
    hexColor: "#B197FC",
    status: "active",
  },
  {
    id: "c7",
    userId: "u1",
    name: "Trasporti",
    emoji: "🚌",
    type: "expense",
    hexColor: "#4BCFFA",
    status: "active",
  },
  {
    id: "c8",
    userId: "u1",
    name: "Shopping",
    emoji: "🛍️",
    type: "expense",
    hexColor: "#FFD93D",
    status: "active",
  },
  {
    id: "c9",
    userId: "u1",
    name: "Salute",
    emoji: "💊",
    type: "expense",
    hexColor: "#6FCF97",
    status: "active",
  },
  {
    id: "c10",
    userId: "u1",
    name: "Casa",
    emoji: "🏠",
    type: "expense",
    hexColor: "#FF6B6B",
    status: "active",
  },
];

export const mockupAccounts = [
  {
    id: "acc1",
    userId: "682e280409285bb856379161",
    name: "Bancomat",
    emoji: "🏧",
    type: "U",
    hexColor: "#4D96FF",
    status: "A",
    __v: 0,
  },
  {
    id: "acc2",
    userId: "682e280409285bb856379161",
    name: "Postepay",
    emoji: "💳",
    type: "U",
    hexColor: "#FFB347",
    status: "A",
    __v: 0,
  },
  {
    id: "acc3",
    userId: "682e280409285bb856379161",
    name: "Buono Pasto",
    emoji: "🍽️",
    type: "voucher",
    hexColor: "#6FCF97",
    status: "A",
    __v: 0,
  },
  {
    id: "acc4",
    userId: "682e280409285bb856379161",
    name: "PayPal",
    emoji: "🅿️",
    type: "U",
    hexColor: "#003087",
    status: "A",
    __v: 0,
  },
  {
    id: "acc5",
    userId: "682e280409285bb856379161",
    name: "Contante",
    emoji: "💵",
    type: "U",
    hexColor: "#FFD700",
    status: "A",
    __v: 0,
  },
  {
    id: "acc6",
    userId: "682e28040921232436379161",
    name: "Buono Amazon",
    emoji: "🎟️",
    type: "voucher",
    hexColor: "#6FCF97",
    status: "A",
    __v: 0,
  },
];


export const mockupStats = [
  {
    title: "Entrate del mese",
    value: "€ 2.450,00",
    percentage: "+12.5%",
    trend: "up", // up = verde
    icon: <ArrowUpCircle className="w-4 h-4 text-emerald-500" />,
  },
  {
    title: "Uscite del mese",
    value: "€ 1.120,00",
    percentage: "+4.2%",
    trend: "down", // in finanza, se le uscite salgono è "male" (rosso)
    icon: <ArrowDownCircle className="w-4 h-4 text-rose-500" />,
  },
  {
    title: "Saldo Totale",
    value: "€ 14.890,42",
    percentage: "+2.1%",
    trend: "up",
    icon: <Wallet className="w-4 h-4 text-blue-500" />,
  },
  {
    title: "Risparmio",
    value: "€ 1.330,00",
    percentage: "-0.5%",
    trend: "down",
    icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
  },
];