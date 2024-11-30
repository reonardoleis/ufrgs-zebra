import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import Input from "@/components/input";
import { useAppContext } from "@/context";

function EditCode() {
    const { puzzleCode, setPuzzleCode} = useAppContext();

    return (
        <Container>
      <Header title="Zebra Puzzle" description="Digite seu código de jogo" />
      <div className="flex flex-col gap-8 w-full mt-8">
      <Input 
              value={puzzleCode}
              placeholder="Digite aqui seu código de jogo"
              onChange={(e) => setPuzzleCode(e.target.value)}
          />
        <Button text="Jogar" href="/play"/>
      </div>
    </Container>
    )
}

export default EditCode;