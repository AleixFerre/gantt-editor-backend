export type CreateGroupInput = {
  name: string;
  color: string;
  board: number;
  order?: number;
};

export type ReorderEntry = Record<string, number>;
export type ReorderInput = ReorderEntry[];

export type UpdateGroupInput = Partial<{
  name: string;
  color: string;
  order: number;
}>;
