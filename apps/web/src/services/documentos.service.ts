import api from '@/lib/api';
import { DocumentoDto } from '@lexmanager/shared';

export const documentosService = {
  async list(processoId?: string) {
    const { data } = await api.get<DocumentoDto[]>('/documentos', {
      params: processoId ? { processoId } : undefined,
    });
    return data;
  },

  async upload(file: File, processoId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<DocumentoDto>(
      `/documentos/upload${processoId ? `?processoId=${processoId}` : ''}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data;
  },

  async remove(id: string) {
    await api.delete(`/documentos/${id}`);
  },

  getDownloadUrl(id: string) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/documentos/${id}/download`;
  },
};
