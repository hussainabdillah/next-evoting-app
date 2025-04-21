// // app/admin/page.tsx
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import prisma from "@/lib/prisma";

// export default async function AdminPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "admin") {
//     return <div>Unauthorized</div>;
//   }

//   const users = await prisma.user.findMany();

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">Admin Dashboard</h1>
//       <ul className="mt-4">
//         {users.map(user => (
//           <li key={user.id}>{user.email} - {user.role}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import { OverViewPageView } from '@/sections/admin/overview/view';

export const metadata = {
  title: 'Admin : Overview'
};

export default function page() {
  return <OverViewPageView />;
}
