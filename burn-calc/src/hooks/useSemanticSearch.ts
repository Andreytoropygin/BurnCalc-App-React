import { useState, useEffect, useRef } from 'react';
import type { Compound } from '../modules/compoundsApi';
import { cosineSimilarity } from '../modules/math';

export interface SimilarCompound extends Compound {
    score: number;
}

export const useSemanticSearch = (allCompounds: Compound[], currentId?: number) => {
    const [similarCompounds, setSimilarCompounds] = useState<SimilarCompound[]>([]);
    const [isModelReady, setIfModelReady] = useState(false);
    const [areEmbeddingsReady, setIfEmbeddingsReady] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const workerRef = useRef<Worker | null>(null);
    const embeddingsRef = useRef<Record<number, number[]>>({});

    useEffect(() => {
        // Инициализация воркера
        workerRef.current = new Worker(new URL('../workers/similarity.worker.ts', import.meta.url), {
            type: 'module'
        });

        workerRef.current.onmessage = (e) => {
            const { type, data } = e.data;

            if (type === 'progress') {
                setProgress(data.progress || 0);
            } else if (type === 'ready') {
                setIfModelReady(true);
            } else if (type === 'embeddings_ready') {
                embeddingsRef.current = data;
                if (currentId) {
                    findSimilar(currentId);
                }
                setIfEmbeddingsReady(true);
            }
        };

        // Запускаем инициализацию и расчет векторов для всех товаров
        workerRef.current.postMessage({ type: 'init', data: allCompounds });

        return () => {
            workerRef.current?.terminate();
        };
    }, [allCompounds]);

    // Функция поиска
    const findSimilar = (id: number) => {
        const targetEmbedding = embeddingsRef.current[id];
        if (!targetEmbedding) return;
        const scored = allCompounds
            .filter(c => c.id !== id) // Исключаем текущий товар
            .map(c => {
                const emb = embeddingsRef.current[c.id];
                if (!emb) return { ...c, score: 0 };
                const score = cosineSimilarity(targetEmbedding, emb);
                return { ...c, score: score * 100 };
            })
            .sort((a, b) => b.score - a.score) // Сортировка по убыванию схожести
            .slice(0, 3);
    
        setSimilarCompounds(scored);
    };

    useEffect(() => {
        if (currentId && isModelReady && embeddingsRef.current[currentId]) {
            findSimilar(currentId);
        }
    }, [currentId, isModelReady]);

    return { similarCompounds, isModelReady, areEmbeddingsReady, progress };
};