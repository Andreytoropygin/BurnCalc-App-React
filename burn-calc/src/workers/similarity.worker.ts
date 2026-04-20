import { 
    env, 
    AutoTokenizer, 
    SiglipTextModel 
} from '@huggingface/transformers';
import type { Compound } from '../modules/compoundsApi';

// Отключаем локальные модели, используем CDN/HF Hub
env.allowLocalModels = false;
env.allowRemoteModels = true;

const MODEL_ID = 'Xenova/siglip-base-patch16-224';

class SimilarityService {
    static tokenizer: any = null;
    static model: any = null;

    static async init(progress_callback?: (data: any) => void) {
        if (!this.tokenizer) {
            const options = { device: 'wasm', dtype: 'q8' } as const;
            this.tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID, { progress_callback });
            this.model = await SiglipTextModel.from_pretrained(MODEL_ID, { ...options, progress_callback });
        }
    }
}

self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    try {
        if (type === 'init') {
            const compounds: Compound[] = data;

            // Инициализация модели
            await SimilarityService.init((msg: any) => {
                if (msg.status === 'progress') {
                    self.postMessage({ type: 'progress', data: msg });
                } else if (msg.status === 'ready' || msg.status === 'done') {
                    self.postMessage({ type: 'ready' });
                }
            });
            const descriptions: string[] = compounds.map((c: any) => c.description || "missing description");
            
            // Токенизация
            const text_inputs = await SimilarityService.tokenizer(descriptions, { 
                padding: true, 
                truncation: true 
            });

            // Получение эмбеддингов
            const { pooler_output } = await SimilarityService.model(text_inputs);
            
            const embeddings: Record<number, number[]> = {};
            const embeddingSize = 768;

            for (let i = 0; i < compounds.length; i++) {
                const start = i * embeddingSize;
                const end = start + embeddingSize;
                const vector: number[] = Array.from(pooler_output.data.slice(start, end));
                embeddings[compounds[i].id] = vector;
            }
            self.postMessage({ type: 'embeddings_ready', data: embeddings });
        }

    } catch (error) {
        console.error(error);
        self.postMessage({ type: 'error', data: error });
    }
});