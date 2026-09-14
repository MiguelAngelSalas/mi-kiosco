import { getProducts } from "../db/CrudProducts"
import CheckoutMenu from "../components/CheckoutMenu" // O la ruta donde tengas tu componente cliente actual

export default async function CheckoutPage() {
    const productos = await getProducts()

    return <CheckoutMenu initialProducts={productos} />
}