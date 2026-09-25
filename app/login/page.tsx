"use client"
import { TextField, Button, Flex, Card, Heading, Callout } from "@radix-ui/themes"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { loginUserAction } from "../admin/actions"

export default function Login() {
    const [inputUsername, setInputUsername] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)
        setLoading(true)

        const result = await loginUserAction(inputUsername, inputPassword)
        setLoading(false)

        if (result.error) {
            setErrorMsg(result.error)
            toast.error(result.error)
            return
        }

        const role = result.role!
        toast.success(`Bienvenido ${inputUsername}!`)

        // Guardamos rol y token (si existe) para próximas peticiones
        localStorage.setItem("rolUsuario", role)
        if (result.token) {
            localStorage.setItem("token", result.token)
        }

        if (role === "administrador") {
            router.push("/AdminPage")
        } else {
            router.push("/CheckoutMenu")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 min-h-screen p-9 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">  
            <Link 
                href="/landingPage" 
                className="text-xl font-bold flex justify-center mb-6 text-pretty rounded py-4 px-8 shadow-lg transition-all duration-300 hover:scale-105 border-[3px] border-[#33589c] text-[#33589c] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#33589c] hover:text-white dark:hover:bg-[#33589c]"
            >
                My Kiosco
            </Link>

            <Card className="w-80 p-8 transition-all duration-300 hover:shadow-xl border-2 border-[#33589c] bg-white dark:bg-gray-800">
                <form onSubmit={handleLogin}>
                    <Flex direction="column" gap="4">
                        <Heading size="4" align="center" className="text-[#33589c] dark:text-white">
                            Sign In
                        </Heading>

                        {errorMsg && (
                            <Callout.Root color="crimson" size="1">
                                <Callout.Icon>
                                    <InfoCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>{errorMsg}</Callout.Text>
                            </Callout.Root>
                        )}
                        
                        <Flex direction="column" gap="3">
                            <TextField.Root 
                                radius="small" 
                                size="3"
                                disabled={loading}
                                className="transition-colors border border-gray-300 dark:border-gray-600 hover:border-[#33589c] dark:hover:border-[#33589c] bg-transparent"
                                value={inputUsername} 
                                onChange={(e) => setInputUsername(e.target.value)} 
                                placeholder="Username"
                                required
                            />
                            <TextField.Root 
                                radius="small" 
                                size="3"
                                disabled={loading}
                                className="transition-colors border border-gray-300 dark:border-gray-600 hover:border-[#33589c] dark:hover:border-[#33589c] bg-transparent"
                                value={inputPassword} 
                                onChange={(e) => setInputPassword(e.target.value)} 
                                placeholder="Password" 
                                type="password"
                                required
                            />
                        </Flex>
                        
                        <Button 
                            type="submit"
                            size="3"
                            variant="ghost"
                            disabled={loading}
                            className="mt-3 cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#589c33] text-[#589c33] dark:text-white bg-transparent hover:bg-[#589c33] hover:text-white dark:hover:bg-[#589c33]"
                        >
                            {loading ? "Entrando..." : "Enter"}
                        </Button>

                        <div className="text-center mt-2">
                            <Link href="/createUser" className="text-xs text-[#33589c] dark:text-blue-400 hover:underline">
                                ¿No tenés cuenta? Registrate
                            </Link>
                        </div>
                    </Flex>
                </form>
            </Card>
        </div> 
    )
}