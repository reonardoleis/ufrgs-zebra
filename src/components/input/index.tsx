import React from "react";

type InputProps = {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    fontSize?: number;
    width?: string;
    height?: string;
}

function Input({
        placeholder = '',
        fontSize = 20,
        width = '100%', 
        height = 'auto',
    }: InputProps) {
        const input = (
            <input 
                type="text" 
                id="code" 
                className="border border-gray-300 text-black text-sm rounded-lg 
                           focus:ring-black focus:border-black block w-full p-2.5 " 
                placeholder={placeholder} 
                style={{
                    width: width,
                    height: height,
                    fontSize: `${fontSize}pt`,
                }}/>
        );

        return input;
}

export default Input;