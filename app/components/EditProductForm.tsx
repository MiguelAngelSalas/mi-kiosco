import { Button, Flex, TextField, Text } from "@radix-ui/themes"
import { Save, Loader2 } from "lucide-react"
import { Categoria } from "./EditProductModal" // Ajustá la ruta según dónde lo guardes

interface EditProductFormProps {
    editForm: any
    setEditForm: (form: any) => void
    handleSubmit: (e: React.FormEvent) => void
    onClose: () => void
    loading: boolean
    categoria: Categoria[]
}

export default function EditProductForm({ 
    editForm, setEditForm, handleSubmit, onClose, loading, categoria 
}: EditProductFormProps) {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            {/* --- CUERPO --- */}
            <div className="p-6 flex flex-col gap-5 max-h-[65vh] overflow-y-auto">
                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                        Nombre del Producto
                    </Text>
                    <TextField.Root 
                        size="3"
                        radius="large"
                        value={editForm.nombre} 
                        disabled={loading}
                        onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                    />
                </div>

                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                        Código de Barras
                    </Text>
                    <TextField.Root 
                        size="3"
                        radius="large"
                        value={editForm.codigo_barras} 
                        disabled={loading}
                        onChange={(e) => setEditForm({ ...editForm, codigo_barras: e.target.value })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                    />
                </div>
                
                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                        Categoría
                    </Text>
                    <select 
                        value={editForm.id_categoria}
                        disabled={loading}
                        onChange={(e) => setEditForm({ ...editForm, id_categoria: e.target.value })}
                        className="w-full h-[40px] px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:border-[#33589c] focus:ring-1 focus:ring-[#33589c] transition-all disabled:opacity-50"
                    >
                        <option value="" disabled>Seleccionar categoría...</option>
                        {categoria.map((cat) => (
                            <option key={cat.id_categoria} value={String(cat.id_categoria)}>
                                {cat.nombre_categoria}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                            Precio Venta ($)
                        </Text>
                        <TextField.Root 
                            type="number"
                            size="3"
                            radius="large"
                            min="0"
                            step="0.01"
                            disabled={loading}
                            value={editForm.precio_venta === 0 ? "" : editForm.precio_venta} 
                            onChange={(e) => setEditForm({ ...editForm, precio_venta: Number(e.target.value) })}
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                        />
                    </div>
                    <div>
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                            Costo ($)
                        </Text>
                        <TextField.Root 
                            type="number"
                            size="3"
                            radius="large"
                            min="0"
                            step="0.01"
                            disabled={loading}
                            value={editForm.costo === 0 ? "" : editForm.costo} 
                            onChange={(e) => setEditForm({ ...editForm, costo: Number(e.target.value) })}
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                        />
                    </div>
                </div>

                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                        Stock Disponible
                    </Text>
                    <TextField.Root 
                        type="number"
                        size="3"
                        radius="large"
                        min="0"
                        disabled={loading}
                        value={editForm.stock === 0 ? "" : editForm.stock} 
                        onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                    />
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                <Button 
                    type="button" 
                    variant="soft" 
                    color="gray" 
                    onClick={onClose} 
                    disabled={loading}
                    className="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-sm"
                >
                    Cancelar
                </Button>
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b] shadow-sm"
                >
                    {loading ? (
                        <><Loader2 size={16} className="animate-spin mr-1" /> Guardando...</>
                    ) : (
                        <><Save size={16} className="mr-1" /> Guardar Cambios</>
                    )}
                </Button>
            </div>
        </form>
    )
}