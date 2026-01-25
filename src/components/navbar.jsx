import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <div className="sticky w-full p-3 flex items-center justify-between border-b">
      <p className="font-bold">NAVBAR</p>
      <ModeToggle />
    </div>
  );
}
