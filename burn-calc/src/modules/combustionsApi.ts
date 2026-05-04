export interface CombustionDraftBrief {
  combustionId: number | null;
  compoundsCount: number;
}

export const getCombustionDraftBrief = async (): Promise<CombustionDraftBrief> => {
  return await fetch(`/api/combustions/draft-brief`)
    .then(response => response.json());
};
