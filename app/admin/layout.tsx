import React from "react";

export const metadata = {
  title: "Admin Dashboard | ShaadiPlatform.com",
  description: "Manage venues, vendors, bookings, coupons, reviews, blog posts and analytics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
