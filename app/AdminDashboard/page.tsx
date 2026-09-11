"use client"
import { Heading, Table, Button, Card, Text } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPanel() {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    // Security check: Only admins allowed
    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")

        if (!storedRole || storedRole !== "administrador") {
            alert("Access Denied. Admins only.")
            router.push("/login") 
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    if (!isAuthorized) {
        return null 
    }

    // Mock data for inventory and pricing
    const mockInventory = [
        { id: 1, name: "Alfajor Guaymallén Blanco", cost: 300, price: 500, stock: 150 },
        { id: 2, name: "Coca Cola 500ml", cost: 800, price: 1200, stock: 45 },
    ]

    return (
        <div className="flex flex-col gap-5 p-6 h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            
            {/* Header with blue bottom border */}
            <div className="flex justify-between items-center border-b-[3px] border-[#33589c] pb-4">
                <Heading as="h1" size="6" className="text-[#33589c] dark:text-white">
                    Admin Dashboard
                </Heading>
                
                <div className="flex gap-3">
                    {/* Navigation button with blue theme */}
                    <Button 
                        variant="solid" 
                        className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#33589c] text-white hover:bg-[#28467b]"
                        onClick={() => router.push("/CheckoutMenu")}
                    >
                        Go to POS (Checkout)
                    </Button>
                    
                    {/* Logout button with magenta theme */}
                    <Button 
                        variant="solid" 
                        className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#9d3358] text-white hover:bg-[#7d2645]"
                        onClick={() => {
                            localStorage.removeItem("rolUsuario")
                            router.push("/login")
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content Area with heavy blue borders */}
            <Card className="grow border-2 border-[#33589c] rounded-lg bg-white dark:bg-gray-800 p-5 shadow-md">
                <div className="flex flex-col gap-4 h-full">
                    <Heading size="4" className="text-[#9d3358] dark:text-[#d14476]">
                        Product & Price Management
                    </Heading>
                    
                    {/* Table with custom colored headers and borders */}
                    <Table.Root variant="surface" className="w-full border border-[#33589c] rounded-lg overflow-hidden">
                        <Table.Header className="bg-[#33589c]">
                            <Table.Row>
                                <Table.ColumnHeaderCell className="text-white">Product</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="end" className="text-white">Cost</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="end" className="text-white">Sale Price</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="center" className="text-white">Stock</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="center" className="text-white">Actions</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {mockInventory.map((item) => (
                                <Table.Row key={item.id} align="center" className="border-b border-gray-200 dark:border-gray-700">
                                    <Table.RowHeaderCell className="font-medium dark:text-gray-200">{item.name}</Table.RowHeaderCell>
                                    
                                    <Table.Cell justify="end" className="dark:text-gray-300">${item.cost}</Table.Cell>
                                    
                                    {/* Sale price highlighted in green */}
                                    <Table.Cell justify="end">
                                        <Text weight="bold" style={{ color: "#589c33", fontSize: "1.1rem" }}>
                                            ${item.price}
                                        </Text>
                                    </Table.Cell>
                                    
                                    {/* Stock logic: Green if > 50, Magenta if low stock */}
                                    <Table.Cell justify="center">
                                        <Text weight="bold" style={{ color: item.stock < 50 ? "#9d3358" : "#589c33" }}>
                                            {item.stock}
                                        </Text>
                                    </Table.Cell>
                                    
                                    {/* Action button bordered with blue */}
                                    <Table.Cell justify="center">
                                        <Button 
                                            size="1" 
                                            variant="outline" 
                                            className="cursor-pointer border border-[#33589c] text-[#33589c] dark:text-white dark:border-blue-400 hover:bg-[#33589c] hover:text-white"
                                        >
                                            Edit
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </div>
            </Card>

        </div>
    )
}