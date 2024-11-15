'use server'

import axios from 'axios';

const API_BASE_URL = 'http://localhost:11434/api';

export type Model = {
  digest: string
  name: string
  size: number
  family: string
  parameter_size: string
  modified_at: string
  details?: Record<string, string>
}

export async function listModels() {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`);    
    return response.data.models.map((model: Model) => ({
      name: model.name,
      size: model.size,
      modified_at: model.modified_at,
      digest: model.digest,
      family: model.details?.family,
      parameter_size: model.details?.parameter_size
    }));
  } catch (error) {
    console.error('Error listing models:', error);
    throw new Error('Failed to list models');
  }
}

export async function getModelInfo(modelName: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/show`, {
      name: modelName
    });
    return response.data;
  } catch (error) {
    console.error('Error getting model info:', error);
    throw new Error('Failed to get model information');
  }
}

export async function deleteModel(modelName: string) {
  try {
    await axios.delete(`${API_BASE_URL}/delete`, {
      data: {
        name: modelName
      }
    });
  } catch (error) {
    console.error('Error deleting model:', error);
    throw new Error('Failed to delete model');
  }
}

export async function pullModel(modelName: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/pull`, { name: modelName });
    return response.data;
  } catch (error) {
    console.error('Error pulling model:', error);
    throw new Error('Failed to pull model');
  }
}

export async function generateEmbeddings(modelName: string, text: string) {
  console.log(modelName);
  console.log(text);
  
  
  try {
    const response = await axios.post(`${API_BASE_URL}/embed`, {
      model: modelName,
      input: text
     });
    return response.data;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
}