import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import { useAppContext } from "@/context";

export default function Home() {
  const { setMenuOption } = useAppContext();
  
  return (
    <Container>
      <Header title="Zebra Puzzle" description="Crie, edite ou jogue um Zebra Puzzle." />
      <div className="flex flex-col gap-8 w-full mt-8">
        <Button text="Jogar" height="75px" fontSize={32} onClick={() => setMenuOption('play')} href="/play-code"/>
        <Button text="Criar" height="75px" fontSize={32} onClick={() => setMenuOption('create')} href="/puzzle-admin" />
        <Button text="Editar" height="75px" fontSize={32} onClick={() => setMenuOption('edit') } href="/edit-code"/>
      </div>
    </Container>
  );
}
