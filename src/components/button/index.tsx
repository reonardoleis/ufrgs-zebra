import themes from "@/themes";
import { useRouter } from "next/router";

type ButtonProps = {
    text: string;
    href?: string;
    fontSize?: number;
    onClick?: () => void;
    width?: string;
    height?: string;
    color?: string;
}

function Button({
        text, 
        onClick,
        href,
        fontSize = 32,
        width = '100%', 
        height = '75px',
        color = themes.colors.buttons.primary
    }: ButtonProps) {
        const router = useRouter();

        const button = (
        <button 
            onClick={() => {
                if (onClick) onClick();
                if (href) router.push(href);
            }} 
            className="rounded-md text-white hover:opacity-90 transition p-2"
            style={{
                backgroundColor: color,
                width: width,
                height: height,
                fontSize: `${fontSize}pt`,
            }}>
            {text}
        </button>
        );

        return button;
}

export default Button;