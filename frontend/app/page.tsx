import { OrderManagementTable } from "@/components/OrderManagementTable";

export default function Home() {
  return (
   <main>
    <section>
      <h1 className="text-4xl">CheckMinistry</h1>
      <h2 className="my-4 font-bold">Order Management</h2>
      <OrderManagementTable />
    </section>
   </main>
  );
}
