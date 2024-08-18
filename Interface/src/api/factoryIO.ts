import axios from "axios";

const API_BASE_URL = "http://localhost:7410/api";

export interface Tag {
  name: string;
  id: string;
  address: number;
  type: "Bit" | "Int" | "Float";
  kind: "Input" | "Output";
  value: boolean | number;
  openCircuit: boolean;
  shortCircuit: boolean;
  isForced: boolean;
  forcedValue: boolean | number;
}

export const api = {
  getTags: async (filters?: {
    name?: string;
    type?: string;
    kind?: string;
  }): Promise<Tag[]> => {
    const response = await axios.get<Tag[]>(`${API_BASE_URL}/tags`, {
      params: filters,
    });
    return response.data;
  },
  getTagValues: async (tagIds: string[]): Promise<Tag[]> => {
    const response = await axios.get<Tag[]>(`${API_BASE_URL}/tag/values`, {
      data: tagIds,
    });
    return response.data;
  },
  getTagById: async (id: string): Promise<Tag> => {
    const response = await axios.get<Tag>(`${API_BASE_URL}/tags/${id}`);
    return response.data;
  },
  setTagValue: async (id: string, value: boolean | number): Promise<void> => {
    await axios.put(`${API_BASE_URL}/tag/values`, [{ id, value }]);
  },
  setTagForce: async (id: string, value: boolean | number): Promise<void> => {
    await axios.put(`${API_BASE_URL}/tag/values-force`, [{ id, value }]);
  },
  releaseTagForce: async (id: string): Promise<void> => {
    await axios.put(`${API_BASE_URL}/tag/values-release`, [id]);
  },
  setTagAlwaysOff: async (id: string): Promise<void> => {
    await axios.put(`${API_BASE_URL}/tag/values-alwaysoff`, [
      { id, value: true },
    ]);
  },
  setTagAlwaysOn: async (id: string): Promise<void> => {
    await axios.put(`${API_BASE_URL}/tag/values-alwayson`, [
      { id, value: true },
    ]);
  },
};
