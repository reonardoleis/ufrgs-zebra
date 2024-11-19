import themes from "@/themes";
import { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
}

function Container({ children }: ContainerProps) {
    return (
        <div 
            className="flex items-center flex-col justify-center w-[100vw] h-[100vh]" 
            style={
                { 
                    backgroundColor: themes.colors.background.primary,
                    color: themes.colors.text.primary,
                }
            }>
           <div className="flex items-center flex-col justify-center md:w-[75vw] w-[90vw]">
           { children }
           </div>
        </div>
    )
}

export default Container;