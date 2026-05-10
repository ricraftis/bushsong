import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", monthlyOrderLimitActive: true, currentMonthlyOrders: 0 },
  });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function addProduct(formData: FormData) {
    "use server";
    await prisma.product.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        imageUrl: formData.get("imageUrl") as string || null,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin");
  }

  async function toggleLimit() {
    "use server";
    const current = await prisma.siteSettings.findUnique({ where: { id: "default" }});
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: { monthlyOrderLimitActive: !current?.monthlyOrderLimitActive },
    });
    revalidatePath("/");
    revalidatePath("/admin");
  }

  async function forceOrderCount(formData: FormData) {
    "use server";
    const count = parseInt(formData.get("count") as string, 10);
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: { currentMonthlyOrders: count },
    });
    revalidatePath("/");
    revalidatePath("/admin");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-brand-green mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-green/10 h-fit">
          <h2 className="text-2xl font-bold text-brand-wood mb-6">Hobbyist Guardrails</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-lg">Monthly Limit</p>
                <p className="text-sm text-gray-500">Currently: {settings.monthlyOrderLimitActive ? "Active" : "Disabled"}</p>
              </div>
              <form action={toggleLimit}>
                <button type="submit" className={`px-4 py-2 rounded font-bold ${settings.monthlyOrderLimitActive ? "bg-amber-600 text-white" : "bg-gray-300 text-gray-700"}`}>
                  {settings.monthlyOrderLimitActive ? "Disable Limit" : "Enable Limit"}
                </button>
              </form>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-lg">Current Orders</p>
                <p className="text-sm text-gray-500">Triggers gallery mode at 5</p>
              </div>
              <form action={forceOrderCount} className="flex gap-2">
                <input type="number" name="count" defaultValue={settings.currentMonthlyOrders} className="w-20 border p-2 rounded" />
                <button type="submit" className="bg-brand-wood text-white px-4 py-2 rounded font-bold">Set</button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-green/10">
          <h2 className="text-2xl font-bold text-brand-wood mb-6">Add Product</h2>
          <form action={addProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" name="name" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" required className="w-full border p-2 rounded h-24" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input type="number" step="0.01" name="price" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="text" name="imageUrl" className="w-full border p-2 rounded" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded hover:bg-brand-green/90">
              Add Piece
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-brand-green/10">
        <h2 className="text-2xl font-bold text-brand-wood mb-6">Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">${p.price.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      p.status === "AVAILABLE" ? "bg-green-100 text-green-800" :
                      p.status === "RESERVED" ? "bg-amber-100 text-amber-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
