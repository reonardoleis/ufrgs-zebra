export type Possibility = {
    column: string;
    values: string[];
};

export type Restrictions = {
    [key: string]: {
        [key: string]: string[];
    };
}

export type Knowns = {
    [key: string]: {
      [key: string]: string
    }
};

export type  ZebraPuzzle = {
    columns: string[];
    possibilities: Possibility[];
    entities: string[];
    restrictions: Restrictions;
    known: Knowns;
};

export type Combination = {
    entity: string;
    columns: { [key: string]: string };
};