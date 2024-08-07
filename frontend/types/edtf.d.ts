type Levels = 0 | 1 | 2;
type BasicDate = {
  values: number[];
  offset: number;
  type: 'Date';
  level: Levels;
  approximate: boolean;
  uncertain: boolean;
  unspecified: boolean;
};
type Interval = { type: 'Interval'; level: Levels; values: BasicDate[] };

declare module 'edtf' {
  function parse(
    input: string,
    constraints: { level: Levels },
  ): BasicDate | Interval; // incomplete stub for now
}
