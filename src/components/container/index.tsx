import themes from "@/themes";
import { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    loading?: boolean;
}

function Container({ children, loading = false }: ContainerProps) {
    return (

        <div 
            className="flex items-center flex-col justify-center w-[100vw] min-h-[100vh] h-[fit-content] bg-white" 
            style={
                { 
                    backgroundColor: themes.colors.background.primary,
                    color: themes.colors.text.primary,
                }
            }>
           <div className="flex items-center flex-col justify-center md:w-[75vw] w-[90vw]">
           { !loading ? children : <img src="/loading.webp"/> }
           </div>
        </div>

    )
}

export default Container;