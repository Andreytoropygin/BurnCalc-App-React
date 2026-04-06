import { COMPOUNDS_MOCK } from "./mock";

export interface Compound {
  id: number;
  title: string;
  formula: string;
  class: string;
  specificH2oVolume: number;
  specificCo2Volume: number;
  imageUrl?: string;
  videoUrl?: string;
}

export const getCompoundsByName = async (query = ""): Promise<Compound[]> => {
  if (!query) return COMPOUNDS_MOCK;
  return COMPOUNDS_MOCK.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );
};

export const getCompoundById = async (id: string): Promise<Compound | undefined> => {
  return COMPOUNDS_MOCK.find((c) => String(c.id) === id);
};
