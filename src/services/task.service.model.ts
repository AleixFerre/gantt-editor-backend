export type CreateTaskInput = {
  name: string;
  color: string;
  start: number;
  duration: number;
  group?: number | null;
  order?: number;
};

export type ReorderEntry = Record<string, number>;
export type ReorderInput = ReorderEntry[];

export type UpdateTaskInput = Partial<{
  name: string;
  color: string;
  order: number;
  start: number;
  duration: number;
  group: number | null;
}>;
