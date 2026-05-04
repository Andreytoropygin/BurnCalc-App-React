export interface Compound {
  id: number;
  title: string;
  formula: string;
  class: string;
  specificH2oVolume: number;
  specificCo2Volume: number;
  imageUrl: string | null;
  videoUrl: string | null;
  description_eng: string;
  description_rus: string;
}

export const getCompoundsByName = async (query = ""): Promise<Compound[]> => {
  const url = query.trim()
    ? `/api/compounds?search=${encodeURIComponent(query)}` 
    : '/api/compounds';

  return await fetch(url).then(response => response.json());
}

export const getCompoundById = async (id: string): Promise<Compound> => {
  return await fetch(`/api/compounds/${id}`).then(response => response.json());
};
