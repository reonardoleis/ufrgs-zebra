import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import { useAppContext } from "@/context";
import { getPuzzleByCode, solver, zebraPuzzleFactory } from "@/services";
import { Combination, ZebraPuzzle } from "@/services/types";
import { deepEqual } from "@/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Play() {
    const { puzzleCode, puzzle, setPuzzle } = useAppContext();
    const [puzzleInstance, setPuzzleInstance] = useState<ZebraPuzzle>(zebraPuzzleFactory());
    const [solution, setSolution] = useState<Combination[]>([]);
    const [solved, setSolved] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (!puzzleCode || puzzleCode === '') router.push('/');
        getPuzzleByCode(puzzleCode)
            .then((puzzle) => {
                setPuzzle(puzzle);

                const parsedPuzzleInstance: ZebraPuzzle = JSON.parse(puzzle?.puzzle!);
                setPuzzleInstance(parsedPuzzleInstance);

                const initialSolution: Combination[] = [];
                parsedPuzzleInstance.entities.forEach(entity => {
                    initialSolution.push({
                        entity: entity,
                        columns: Object.fromEntries(
                            Object.entries(parsedPuzzleInstance.columns).map(([_, column]) => [
                                column,
                                parsedPuzzleInstance.known[entity][column]
                            ])
                        )
                    });
                });

                setSolution(initialSolution);
            })
            .catch((e) => alert("Houve um erro ao carregar seu puzzle." + e));
    }, []);

    const getPossibilities = (column: string, entity: string): string[] => {
        const columnPossibilities =
            puzzleInstance.possibilities.find(possibility => possibility.column === column);

        const entityRestrictions =
            puzzleInstance.restrictions[entity][column];



        return columnPossibilities?.values.filter(value => !entityRestrictions.includes(value)) || [];
    }

    const attempt = () => {
        const validSolutions = solver.solve(puzzleInstance);

        for (const validSolution of validSolutions.validCombinations) {
            if (deepEqual(validSolution, solution)) {
                setSolved(true);
                return;
            }
        }

        alert('Solução inválida');
    }

    const hasKnown = (column: string, entity: string): boolean =>
        puzzleInstance.known[entity][column] !== ''

    const updateColumnForEntity = (column: string, entity: string, value: string) => {
        console.log(`Atualizando coluna ${column} na entidade ${entity} para o valor ${value}.`);
        const index = solution.findIndex(s => s.entity === entity);
        solution[index].columns[column] = value;
        setSolution([ ...solution ]);
    }

    const getGameTable = () => {
        return <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 bg-white text-left mb-8">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-700"></th>
                        {
                            puzzleInstance.columns.map(column => (
                                <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">{column}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        puzzleInstance.entities.map(entity => (
                            <tr className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{entity}</td>
                                {
                                    puzzleInstance.columns.map(column => (
                                        <td className="border border-gray-300 px-4 py-2">
                                            <select
                                                className="w-full text-md border"
                                                disabled={hasKnown(column, entity) || solved}
                                                onChange={(e) => updateColumnForEntity(column, entity, e.target.value)}
                                            >
                                                {!hasKnown(column, entity) && <option value="">-</option>}
                                                {!hasKnown(column, entity) ? getPossibilities(column, entity).map(possibility => (
                                                    <option value={possibility}>{possibility}</option>
                                                )) : <option value={
                                                    puzzleInstance.known[entity][column]
                                                }>{puzzleInstance.known[entity][column]}</option>}
                                            </select>
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }

                </tbody>
            </table>
            { !solved 
                ? <Button text="Corrigir" onClick={attempt} />
                : <h1 className="text-2xl text-green-800">Parabéns! A sua solução está correta.</h1>    
            }
        </div>
    }

    return (
        <Container loading={puzzle === undefined}>
            <Header title="Zebra Puzzle" description={`Jogando puzzle #${puzzle?.id}`} />
            <div className="flex flex-col gap-8 w-full mt-8">
                {getGameTable()}
            </div>
        </Container>
    )
}

export default Play;