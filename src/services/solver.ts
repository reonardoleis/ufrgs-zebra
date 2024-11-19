import { Combination, ZebraPuzzle } from "./types";

type CombinationGenerator = (zebraPuzzle: ZebraPuzzle) => Combination[][];
type ValidCombinationsFilter = (combinations: Combination[][], zebraPuzzle: ZebraPuzzle) => Combination[][];
type SolverResult = {
    validCombinations: Combination[][];
    isSolvable: boolean;
}

type Solver = {
    solve: (zebraPuzzle: ZebraPuzzle) => SolverResult;
};

const generateCombinations = (zebraPuzzle: ZebraPuzzle): Combination[][] => {
    const { columns, possibilities, entities } = zebraPuzzle;

    const availableOptions: { [key: string]: string[] } = {};
    possibilities.forEach(({ column, values }) => {
        availableOptions[column] = [...values];
    });

    const result: Combination[][] = [];

    function backtrack(currentCombination: Combination[], entityIndex: number, usedValues: Set<string>) {
        if (entityIndex === entities.length) {
            result.push(currentCombination.map(comb => ({ ...comb })));
            return;
        }

        const entity = entities[entityIndex];
        const tempColumns: { [key: string]: string } = {};

        const fillColumns = (index: number) => {
            if (index === columns.length) {
                currentCombination.push({ entity, columns: { ...tempColumns } });
                backtrack(currentCombination, entityIndex + 1, usedValues);
                currentCombination.pop();
                return;
            }

            const column = columns[index];
            for (const value of availableOptions[column]) {
                if (!usedValues.has(value)) {
                    tempColumns[column] = value;
                    usedValues.add(value);

                    fillColumns(index + 1);

                    delete tempColumns[column];
                    usedValues.delete(value);
                }
            }
        };

        fillColumns(0);
    }

    backtrack([], 0, new Set());

    return result;
}

const filterValidCombinations = (
    combinations: Combination[][],
    zebraPuzzle: ZebraPuzzle
): Combination[][] => {
    const validCombinations: Combination[][] = [];
    const isValidCombination = (combination: Combination) => {
        const { entity, columns } = combination;
        
        if (zebraPuzzle.restrictions[entity]) {
            const entityRestrictions = zebraPuzzle.restrictions[entity];
            for (const column in entityRestrictions) {
                if (entityRestrictions.hasOwnProperty(column)) {
                    const restrictedValues = entityRestrictions[column];
                    if (restrictedValues.includes(columns[column])) {
                        return false;
                    }
                }
            }
        }

        if (zebraPuzzle.known[entity]) {
            const entityKnownValues = zebraPuzzle.known[entity];
            for (const column in entityKnownValues) {
                if (entityKnownValues.hasOwnProperty(column)) {
                    const requiredValue = entityKnownValues[column];
                    if (columns[column] !== requiredValue) {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    for (const combination of combinations) {
        const isValid = combination.every(isValidCombination);
        if (isValid) {
            validCombinations.push(combination);
        }
    }

    return validCombinations;
}

export const solverFactory = (
    combinationGenerator: CombinationGenerator = generateCombinations, 
    validCombinationsFilter: ValidCombinationsFilter =  filterValidCombinations,
): Solver => ({
    solve: (zebraPuzzle: ZebraPuzzle) => {
        const validCombinations = validCombinationsFilter(combinationGenerator(zebraPuzzle), zebraPuzzle);
        return {
            validCombinations,
            isSolvable: validCombinations.length > 0,
        };
    },
});