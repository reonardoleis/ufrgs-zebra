import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type HeaderProps = {
    title: string;
    description: string;
}

function Header({ title, description = ''} : HeaderProps) {
    const router = useRouter();
    const [ showHomeLink, setShowHomeLink ] = useState(false);

    useEffect(() => setShowHomeLink(window.location.pathname !== '/'), []);
    
    const backToHome = () => {
        router.push('/');
    }

    return (
        <div className="pb-4 border-b border-gray-400 w-full">
            { showHomeLink && <span style={{ cursor: 'pointer' }} onClick={backToHome}>← Início</span>}
            <h1 className="text-[30pt]">{title}</h1>
            <h2 className="text-[20pt] text-gray-600">{description}</h2>
        </div>
    )
}

export default Header;