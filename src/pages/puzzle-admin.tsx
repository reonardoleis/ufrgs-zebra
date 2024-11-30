import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import Input from "@/components/input";
import TabSelector from "@/components/tabSelector";
import { useAppContext } from "@/context";
import { Puzzle } from "@/entities";
import { getPuzzleByCode, solver, stringifyResult, zebraPuzzleFactory } from "@/services";
import { SolverResult } from "@/services/solver";
import { ZebraPuzzle } from "@/services/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function PuzzleAdmin() {
  const { menuOption, puzzleCode, setPuzzleCode, puzzle, setPuzzle } = useAppContext();
  const [creatorActiveTab, setCreatorActiveTab] = useState(0);
  const [puzzleInstance, setPuzzleInstance] = useState<ZebraPuzzle>(zebraPuzzleFactory());
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [newEntityName, setNewEntityName] = useState<string>("");
  const [newPossibilityValues, setNewPossibilityValues] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<SolverResult | null>();
  const [finished, setFinished] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    switch (menuOption) {
      case "edit": {
        getPuzzleByCode(puzzleCode)
          .then((puzzle) => { 
            if (puzzle?.play_code === puzzleCode) {
              return router.push('/');
            }
            setPuzzle(puzzle); 
            setPuzzleInstance(JSON.parse(puzzle?.puzzle!)) })
          .catch(() => alert("Houve um erro ao carregar seu puzzle."));
        break;
      }
      case "create": {
        setPuzzleCode("");
        setPuzzle(undefined);
        break;
      }
    }
  }, [menuOption, puzzleCode, setPuzzle, setPuzzleCode]);

  const addColumn = () => {
    if (newColumnName.length === 0) return alert("O nome da coluna não pode ser vazio!");
    puzzleInstance.columns.push(newColumnName);
    puzzleInstance.possibilities.push({
      column: newColumnName,
      values: [],
    });
    puzzleInstance.entities.forEach((entity) => {
      puzzleInstance.restrictions[entity][newColumnName] = [];
      puzzleInstance.known[entity][newColumnName] = "";
    });
    setPuzzleInstance({ ...puzzleInstance });
    setNewPossibilityValues({
      ...newPossibilityValues,
      [newColumnName]: [],
    });
    setNewColumnName("");
  };

  const removeColumn = (columnToRemove: string) => {
    const { columns, possibilities } = puzzleInstance;
    const columnIndex = columns.findIndex((column: string) => column === columnToRemove);
    if (columnIndex === -1) return;
    puzzleInstance.entities.forEach((entity) => {
      delete puzzleInstance.restrictions[entity][columnToRemove];
      delete puzzleInstance.known[entity][columnToRemove];
    });
    const updatedPuzzleInstance = {
      ...puzzleInstance,
      columns: columns.filter((_, index) => index !== columnIndex),
      possibilities: possibilities.filter((_, index) => index !== columnIndex),
    };
    const updatedPossibilities = { ...newPossibilityValues };
    delete updatedPossibilities[columnToRemove];
    setNewPossibilityValues(updatedPossibilities);
    setPuzzleInstance(updatedPuzzleInstance);
  };

  const addEntity = () => {
    if (newEntityName.length === 0) return alert("O nome da entidade não pode ser vazio!");
    puzzleInstance.entities.push(newEntityName);
    puzzleInstance.restrictions[newEntityName] = {};
    puzzleInstance.known[newEntityName] = {};
    puzzleInstance.columns.forEach((column) => {
      puzzleInstance.restrictions[newEntityName][column] = [];
      puzzleInstance.known[newEntityName][column] = "";
    });
    setPuzzleInstance({ ...puzzleInstance });
    setNewEntityName("");
  };

  const updatePossibilities = (columnToUpdate: string, newPossibility: string) => {
    const columnIndex = puzzleInstance.columns.findIndex((column) => column === columnToUpdate);
    if (columnIndex !== -1) {
      puzzleInstance.possibilities[columnIndex].values.push(newPossibility);
      setPuzzleInstance({ ...puzzleInstance });
    }
  };

  const removePossibility = (columnToUpdate: string, possibilityToRemove: string) => {
    const columnIndex = puzzleInstance.columns.findIndex((column) => column === columnToUpdate);
    if (columnIndex !== -1) {
      puzzleInstance.possibilities[columnIndex].values = puzzleInstance.possibilities[columnIndex].values.filter(
        (possibility) => possibility !== possibilityToRemove
      );

      puzzleInstance.entities.forEach(entity => {
        const restrictionIndex = puzzleInstance.restrictions[entity][columnToUpdate].findIndex(v => v === possibilityToRemove);
        if (restrictionIndex !== -1) {
          puzzleInstance.restrictions[entity][columnToUpdate].splice(restrictionIndex, 1);
        }
        
        if (puzzleInstance.known[entity][columnToUpdate] === possibilityToRemove) {
          puzzleInstance.known[entity][columnToUpdate] = "";
        } 
      })

      setPuzzleInstance({ ...puzzleInstance });
    }
  };

  const updateRestrictions = (entityToUpdate: string, columnToUpdate: string, value: string, status: boolean) => {
    const updatedRestrictions = { ...puzzleInstance.restrictions };
    if (status) {
      updatedRestrictions[entityToUpdate][columnToUpdate].push(value);
    } else {
      updatedRestrictions[entityToUpdate][columnToUpdate] = updatedRestrictions[entityToUpdate][columnToUpdate].filter(
        (v) => v !== value
      );
    }
    setPuzzleInstance({
      ...puzzleInstance,
      restrictions: updatedRestrictions,
    });
  };

  const updateKnown = (entityToUpdate: string, columnToUpdate: string, value: string) => {
    puzzleInstance.known[entityToUpdate][columnToUpdate] = value !== "-" ? value : "";
    setPuzzleInstance({ ...puzzleInstance });
  };

  const handlePuzzleVerify = () => {
    const s = solver.solve(puzzleInstance);
    setResult(s);
  }

  const handlePuzzleCreation = async () => {
    if (menuOption === 'create') {
      const result = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzle: puzzleInstance,
        }),
      });

      const json = await result.json();
      const puzzle = json.data as Puzzle;
      setPuzzle(puzzle);
    } else {
      await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          edit_code: puzzle?.edit_code,
          puzzle: puzzleInstance,
        }),
      });
    }

    setFinished(true);
  }

  const columns = (
    <div className="flex flex-col gap-3">
      <span className="text-gray-500">Configure as colunas do seu puzzle</span>
      <label>Nova coluna</label>
      <Input onChange={(e) => setNewColumnName(e.target.value)} value={newColumnName} />
      <Button onClick={addColumn} text="Adicionar" width="150px" height="50px" fontSize={14} />
      {puzzleInstance.columns.map((column) => (
        <div className="mt-6 border p-4" key={column}>
          <h1 className="font-bold text-[120%]">Coluna "{column}"</h1>
          <label>Adicionar nova possibilidade:</label> <br />
          <Input
            onChange={(e) =>
              setNewPossibilityValues((prev) => ({
                ...prev,
                [column]: [e.target.value],
              }))
            }
            value={newPossibilityValues[column]?.[0] || ""}
          />
          <Button
            onClick={() => {
              const possibility = newPossibilityValues[column]?.[0];
              if (!possibility) return alert("A possibilidade não pode ser vazia!");
              updatePossibilities(column, possibility);
              setNewPossibilityValues((prev) => ({
                ...prev,
                [column]: [],
              }));
            }}
            text="Adicionar"
            width="100%"
            height="fit-content"
            fontSize={14}
          />
          <div className="mt-4 mb-2 border-b">
            <h1 className="font-bold text-[120%]">Valores:</h1>
            {puzzleInstance.possibilities
              .find((p) => p.column === column)
              ?.values.map((possibility) => (
                <div
                  key={possibility}
                  className="inline-flex items-center mr-2 mb-2 bg-gray-300 px-2 py-1 rounded-full"
                >
                  <span>{possibility}</span>
                  <button
                    onClick={() => removePossibility(column, possibility)}
                    className="ml-4 text-red-500 font-bold text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            {!puzzleInstance.possibilities.find((p) => p.column === column)?.values.length && "Nenhum valor foi adicionado até agora"}
          </div>
          <Button onClick={() => removeColumn(column)} text={`Excluir coluna "${column}"`} width="fit-content" height="50px" fontSize={14} color="red" />
        </div>
      ))}
    </div>
  );

  const entities = (
    <div className="flex flex-col gap-3">
      <span className="text-gray-500">Configure as entidades do seu puzzle</span>
      <label>Nova entidade</label>
      <Input onChange={(e) => setNewEntityName(e.target.value)} value={newEntityName} />
      <Button onClick={addEntity} text="Adicionar" width="150px" height="50px" fontSize={14} />
      {puzzleInstance.entities.map((entity) => (
        <div className="mt-6 border p-4" key={entity}>
          <h1 className="font-bold text-[120%]">Entidade {entity}</h1>
          {puzzleInstance.columns.map((column) => (
            <div key={column}>
              <div className="p-2 border mt-2">
                <h2 className="font-bold text-[105%]">Restrições para coluna {column}:</h2>
                {puzzleInstance.possibilities[puzzleInstance.columns.findIndex((c) => c === column)]?.values.map((value) => (
                  <div key={value}>
                    <input
                      type="checkbox"
                      checked={puzzleInstance.restrictions[entity][column]?.includes(value)}
                      onChange={(e) => updateRestrictions(entity, column, value, e.target.checked)}
                    />
                    {value}
                  </div>
                ))}
              </div>
              <div className="p-2 border mt-2">
                <h2 className="font-bold text-[105%]">Fixo para coluna {column}:</h2>
                <select
                  className="w-full text-md border"
                  value={puzzleInstance.known[entity][column] || "-"}
                  onChange={(e) => updateKnown(entity, column, e.target.value)}
                >
                  <option value="-">-</option>
                  {puzzleInstance.possibilities[puzzleInstance.columns.findIndex((c) => c === column)]?.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const getResultDescription = () => {
    if (!result?.isSolvable) return 'Não é solucionável.';
    else if (result.validCombinations.length > 1) return 'Possui mais de uma possibilidade.';
    else return 'Possui somente uma possibilidade.';
  }

  const getContent = () => {
    if (!finished) {
      return <div className="flex flex-col gap-8 w-full mt-8 bg-white">
      <TabSelector
        tabs={[
          { label: "Colunas", component: columns },
          { label: "Entidades", component: entities },
        ]}
        activeTab={creatorActiveTab}
        onTabChange={(index) => setCreatorActiveTab(index)}
      />
      <Button text="Verificar" onClick={handlePuzzleVerify}/>
      { result && result.isSolvable && result.validCombinations.length === 1 && <Button text={menuOption === 'create' ? 'Criar' : 'Atualizar'} onClick={handlePuzzleCreation} color="green"/> }
      <div className="mt-2" style={{
        display: result ? 'initial' : 'none',
      }}
      >
      <h1 className="text-lg font-bold">Resultado:</h1>
      <div style={{
        color: result?.isSolvable ? 
          result?.validCombinations.length === 1 ? 'green' : '#ff9900'
          : 'red',
      }}>
        {getResultDescription()}
      </div>
      <span   dangerouslySetInnerHTML={{
        __html: (() => {
          if (!result) return  '';

          const resultString = stringifyResult(result);
          if (!resultString) return '';

          return resultString;
        })()
      }}/>

      </div>
    </div>
    };

    if (menuOption === 'create') {
      return <div className="mt-16">
        <h1 className="text-2xl font-bold">Puzzle criado com sucesso!</h1>
        <h2>Código de jogo: {puzzle?.play_code}</h2>
        <h2>Código de edição: {puzzle?.edit_code}</h2>
      </div>
    }

    return <div className="mt-16">
        <h1 className="text-2xl font-bold">Puzzle atualizado!</h1>
        <h2>Código de jogo: {puzzle?.play_code}</h2>
        <h2>Código de edição: {puzzle?.edit_code}</h2>
      </div>
  }
  
  return (
    <Container>
      <Header
        title={puzzle ? `Puzzle #${puzzle.id}` : "Criando novo puzzle"}
        description={menuOption === "edit" ? "Edite o puzzle abaixo" : "Configure seu novo puzzle abaixo"}
        extra={
          menuOption === "edit" ? `Código de jogo: ${puzzle?.play_code}<br/>Código de edição: ${puzzle?.edit_code}` : ''
        }
      />
      {getContent()}
    </Container>
  );
}

export default PuzzleAdmin;
