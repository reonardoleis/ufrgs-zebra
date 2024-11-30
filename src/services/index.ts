import { Puzzle } from "@/entities";
import { solverFactory, SolverResult } from "./solver";
import { Combination, ZebraPuzzle } from "./types";

async function getPuzzleByCode(code: string) {
    try {
        const result = await fetch(`/api/find?code=${code}`);
        if (result.status === 404) {
            alert('Puzzle não encontrado.');
            return;
        }

        const json = await result.json();
        return json.data as Puzzle;
    } catch (e) {
        alert('Erro ao buscar puzzle.');
    }
}

const solver = solverFactory();

const zebraPuzzleFactory = (): ZebraPuzzle => ({
    columns: [],
    possibilities: [],
    entities: [],
    restrictions: {},
    known: {},
});

const stringifyResult = (solution: SolverResult): string | null => {
    if (solution.validCombinations.length > 0) {
        const results = solution.validCombinations.map((combination: Combination[], index: number) => {
            return `Possibilidade #${index}: ${combination.map(c => `${c.entity} usa ${Object.entries(c.columns).map(([key, value]) => `${key} ${value}`).join(', ')}`).join(', ')}`;
        }).join('<br>');
        return results;
    }

    return null;
}

export { getPuzzleByCode, solver, zebraPuzzleFactory, stringifyResult };