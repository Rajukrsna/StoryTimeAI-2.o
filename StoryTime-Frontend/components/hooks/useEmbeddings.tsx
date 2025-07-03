// hooks/getEmbeddings.tsx
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

/**
 * Load the Universal Sentence Encoder model and return an embedding vector for the input text.
 * @param text The input text string to embed
 * @returns A Promise that resolves to a number array representing the embedding vector
 */
let model: use.UniversalSentenceEncoder | null = null;
const getEmbeddings = async (text: string): Promise<number[]> => {
  await tf.setBackend('cpu');

  if (!model) {
    model = await use.load();
  }
  const embeddings = await model.embed([text]);
  const embeddingArray = await embeddings.array();
  return embeddingArray[0] as number[];
};

export default getEmbeddings;
