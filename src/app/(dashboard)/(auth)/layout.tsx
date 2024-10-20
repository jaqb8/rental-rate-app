export const revalidate = +(process.env.NEXT_REVALIDATION_TIME ?? 0) || 3600;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
