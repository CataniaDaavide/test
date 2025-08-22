export function Card({ children }) {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-center p-6 rounded-lg border border-border-card bg-card shadow-md">
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return <p className="text-2xl font-semibold">{children}</p>;
}

export function CardDescription({ children }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
