export type CreateGroupInput = {
  name: string;
  color: string;
  board: number;
  order?: number;
};

export type UpdateGroupInput = Partial<{
  name: string;
  color: string;
  order: number;
}>;
