import { Puzzle } from "@/entities";
import React, { createContext, useState, ReactNode, useContext } from "react";

type MenuOption = 'play' | 'edit' | 'create' | null;

type AppContextProps = {
  menuOption: MenuOption;
  setMenuOption: React.Dispatch<React.SetStateAction<MenuOption>>;
  puzzleCode: string;
  setPuzzleCode: React.Dispatch<React.SetStateAction<string>>;
  puzzle?: Puzzle;
  setPuzzle: React.Dispatch<React.SetStateAction<Puzzle | undefined>>;
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuOption, setMenuOption] = useState<MenuOption>(null);
  const [puzzleCode, setPuzzleCode] = useState<string>('');
  const [puzzle, setPuzzle] = useState<Puzzle | undefined>();

  return (
    <AppContext.Provider value={{ 
      menuOption, 
      setMenuOption,
      puzzleCode,
      setPuzzleCode,
      puzzle,
      setPuzzle,
      }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, useAppContext };
