import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import { useAppContext } from "@/context";
import { getPuzzleByEditCode } from "@/services";
import { useEffect } from "react";

function PuzzleAdmin() {
    const { menuOption, puzzleCode, setPuzzleCode, puzzle, setPuzzle } = useAppContext();

    useEffect(() => {
        switch (menuOption) {
            case 'edit': {
                getPuzzleByEditCode(puzzleCode)
                .then(puzzle => setPuzzle(puzzle))
                .catch(() => alert('Houve um erro ao carregar seu puzzle.'));
                break;
            }

            case 'create': {
                setPuzzleCode('');
                setPuzzle(undefined);
                break;
            }
        }
    });

    return (
        <Container>
      <Header 
        title={puzzle ? `Puzzle #${puzzle.id}` : 'Criando novo puzzle'}
        description={menuOption === 'edit' ? 'Edite o puzzle abaixo' : 'Configure seu novo puzzle abaixo'}
        />
      <div className="flex flex-col gap-8 w-full mt-8">
       
        <Button text="Criar" />
      </div>
    </Container>
    )
}

export default PuzzleAdmin;