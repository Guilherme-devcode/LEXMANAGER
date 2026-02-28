import api from '@/lib/api';
import { DashboardKpisDto } from '@lexmanager/shared';

export const dashboardService = {
  async getKpis() {
    const { data } = await api.get<DashboardKpisDto>('/dashboard/kpis');
    return data;
  },
};
