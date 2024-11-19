import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import Input from "@/components/input";

function EditCode() {
    return (
        <Container>
      <Header title="Zebra Puzzle" description="Digite seu código de jogo" />
      <div className="flex flex-col gap-8 w-full mt-8">
        <Input 
            placeholder="Digite aqui seu código de jogo"
        />
        <Button text="Jogar" />
      </div>
    </Container>
    )
}

export default EditCode;