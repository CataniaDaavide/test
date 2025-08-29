import TitleComponents from "./title-components";

export default function PercentageBar({ title, percentage, color }) {
  return (
    <div className="w-full h-full flex flex-col">
      <TitleComponents>{title}</TitleComponents>
    <div className="w-full h-[10px] rounded-full bg-zinc-200 dark:bg-zinc-700">
      <div
        className={`h-full rounded-full bg-background-inverse`}
        style={{ width: `${percentage}%`}}
        />
    </div>
        </div>
  );
}


