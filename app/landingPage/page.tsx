import { LinkButton } from "@/app/components/ui/LinkButton";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-8 p-10 h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
            <LinkButton href="/landingPage" size="6" weight="bold" colorTheme="blue">
                My Kiosco
            </LinkButton>

            <div className="flex flex-row items-center justify-center gap-4 rounded-xl p-6 shadow-md border-2 border-[#33589c] bg-white dark:bg-gray-800">
                <LinkButton href="/login" colorTheme="green">
                    Iniciar Sesión
                </LinkButton>
            </div>
        </div>
    );
}