import { Link } from "@radix-ui/themes"

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-8 p-10 h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
            
            {/* Main Brand / Logo - Color: #33589c */}
            <Link 
                href="/landingPage" 
                size="6" 
                weight="bold"
                className="flex justify-center text-pretty rounded py-4 px-8 shadow-lg transition-all duration-300 hover:scale-105 border-[3px] border-[#33589c] text-[#33589c] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#33589c] hover:text-white dark:hover:bg-[#33589c]"
            >
                My Kiosco
            </Link>

            {/* Actions Container - Border Color: #33589c */}
            <div className="flex flex-row items-center justify-center gap-6 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg border-2 border-[#33589c] bg-white dark:bg-gray-800">
                
                {/* Login Button - Color: #589c33 */}
                <Link 
                    href="/login" 
                    size="4" 
                    weight="medium"
                    className="flex justify-center w-full text-pretty rounded py-2 px-6 shadow-sm transition-all duration-200 hover:scale-105 border-2 border-[#589c33] text-[#589c33] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#589c33] hover:text-white dark:hover:bg-[#589c33]"
                >
                    Login
                </Link>

                {/* Create User Button - Color: #9d3358 */}
                <Link 
                    href="/createUser" 
                    size="4" 
                    weight="medium"
                    className="flex justify-center w-full text-pretty rounded py-2 px-6 shadow-sm transition-all duration-200 hover:scale-105 border-2 border-[#9d3358] text-[#9d3358] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#9d3358] hover:text-white dark:hover:bg-[#9d3358]"
                >
                    Create User
                </Link>
                
            </div>
        </div>
    )
}