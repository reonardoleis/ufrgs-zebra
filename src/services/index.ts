import { Puzzle } from "@/entities";
import { solverFactory } from "./solver";
import { ZebraPuzzle } from "./types";

async function getPuzzleByEditCode(code: string) {
    await new Promise(resolve => setTimeout(() => resolve(code), 500));
    const puzzle: Puzzle = {
        id: 122918,
        body: '',
        createdAt: '2024-11-17 00:00:00',
        updatedAt: '2024-11-17 00:00:00',
        editCode: 'sLO3mdlfk432Oflk4mAAlsk3j',
        playCode: 'meNasdlerkRTMGnd341o2esK',
    };

    return {
        ...puzzle,
        toInstance: () => JSON.parse(puzzle.body) as ZebraPuzzle,
    };
}

const solver = solverFactory();

export { getPuzzleByEditCode, solver };