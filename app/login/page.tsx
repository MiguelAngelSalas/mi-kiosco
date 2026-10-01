"use client"
import { TextField, Button, Flex, Card, Heading, Callout } from "@radix-ui/themes"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUserAction } from "../admin/actions"
import { LinkButton } from "@/app/components/ui/LinkButton" 
import toast from "react-hot-toast"
import {useLogin} from "@/app/hooks/useLogin"
export default function Login() {

    const {handleLogin, errorMsg, loading, inputUsername,setInputUsername,inputPassword, setInputPassword }=useLogin()

    return (
        <div className="flex flex-col items-center justify-center gap-4 min-h-screen p-9 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">  
            
            <LinkButton 
                href="/landingPage" 
                size="6" 
                weight="bold" 
                colorTheme="blue"
                className="mb-2"
            >
                My Kiosco
            </LinkButton>

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
                    </Flex>
                </form>
            </Card>
        </div> 
    )
}