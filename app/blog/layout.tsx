import BlogFooter from "@/components/blog/BlogFooter";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex-1'>{children}</div>
      <BlogFooter />
    </div>
  );
}
