import { getProducts, getCategorias } from "@/app/db/CrudProducts" // O la ruta donde tengas tu archivo con las funciones
import AdminPanel from "@/app/components/AdminPanel" // Ruta a tu componente cliente
import EditProductModal from "../components/EditProductModal"

export default async function AdminPage() {
    const productos = await getProducts()
    const categorias = await getCategorias() // Asegúrate de tener esta función para obtener las categorías

    // Hacete un console.log acá para ver si Neon devuelve datos en la terminal del servidor
    console.log("Productos desde Neon:", productos)

    return <AdminPanel initialProducts={productos} initialCategorias={categorias} />
}