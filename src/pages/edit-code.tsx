import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import Input from "@/components/input";
import { useAppContext } from "@/context";

function EditCode() {
    const { setMenuOption, setPuzzleCode, puzzleCode } = useAppContext();
    return (
      <Container>
        <Header title="Zebra Puzzle" description="Digite seu código de edição de jogo" />
        <div className="flex flex-col gap-8 w-full mt-8">
          <Input 
              value={puzzleCode}
              placeholder="Digite aqui seu código de edição de jogo"
              onChange={(e) => setPuzzleCode(e.target.value)}
          />
          <Button text="Editar" onClick={() => setMenuOption('edit')} href="/puzzle-admin"/>
        </div>
    </Container>
    )
}

export default EditCode;