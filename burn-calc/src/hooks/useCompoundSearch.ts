import { useState, useRef, useEffect } from 'react';
import type { Compound } from '../modules/compoundsApi';
import { cosineSimilarity } from '../modules/math';

export interface ProcessedCompound extends Compound {
    score: number;
    isVisible: boolean;
    embedding?: number[];
}

export const useCompoundSearch = (initialCompounds: Compound[]) => { 
    const [compounds, setCompounds] = useState<ProcessedCompound[]>(
        initialCompounds.map(compound => ({ ...compound, score: 0, isVisible: true }))
    );
    
    const [imageEmbedding, setImageEmbedding] = useState<number[] | null>(null);
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        setCompounds(initialCompounds.map(compound => ({ ...compound, score: 0, isVisible: true })));
    }, [initialCompounds]);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/search.worker.ts', import.meta.url), {
            type: 'module'
        });

        workerRef.current.onmessage = (e) => {
            const { type, data } = e.data;

            switch (type) {
                case 'progress':
                    if (data.status === 'progress') setProgress(data.progress);
                    else if (data.status === 'ready') setReady(true);
                    break;
                
                case 'text_embeddings_ready':
                     setCompounds(prev => prev.map(compound => ({
                        ...compound,
                        embedding: data[compound.id]
                    })));
                    setReady(true);
                    break;

                 case 'image_embedding_ready':
                    setImageEmbedding(data);
                    break;
            }
        };

        workerRef.current.postMessage({ type: 'init', data: initialCompounds });

        return () => workerRef.current?.terminate();
    }, [initialCompounds]);

    useEffect(() => {
        if (!imageEmbedding) return;

        setCompounds(prevCompounds => {
            if (!prevCompounds[0]?.embedding) return prevCompounds;

            const threshold = 0.05;

            let processed = prevCompounds.map((compound, i) => {
                if (!compound.embedding) return compound; 
                
                const similarity = cosineSimilarity(imageEmbedding, compound.embedding);
                
                return {
                    ...compound,
                    score: similarity,
                    isVisible: similarity > threshold && i < 4
                };
            });

            processed = processed.sort((a, b) => b.score - a.score);
            
            return processed;
        });

    }, [imageEmbedding]);

    const searchByImage = (file: File) => {
        workerRef.current?.postMessage({ type: 'image', data: file });
    };

    const resetSearch = () => {
        setImageEmbedding(null);
        setCompounds(prev => {
            const sortedById = [...prev].sort((a, b) => a.id - b.id);
            return sortedById.map(compound => ({
                ...compound,
                score: 0,
                isVisible: true
            }));
        });
    };

    return {
        compounds,
        ready,
        progress,
        imageEmbedding,
        searchByImage,
        resetSearch
    };
};