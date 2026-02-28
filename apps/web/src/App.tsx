import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/router/PrivateRoute';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProcessosListPage from '@/pages/processos/ProcessosListPage';
import ProcessoFormPage from '@/pages/processos/ProcessoFormPage';
import ProcessoDetailPage from '@/pages/processos/ProcessoDetailPage';
import ClientesListPage from '@/pages/clientes/ClientesListPage';
import ClienteFormPage from '@/pages/clientes/ClienteFormPage';
import PrazosListPage from '@/pages/prazos/PrazosListPage';
import PrazoFormPage from '@/pages/prazos/PrazoFormPage';
import FinanceiroPage from '@/pages/financeiro/FinanceiroPage';
import LancamentoFormPage from '@/pages/financeiro/LancamentoFormPage';
import DocumentosPage from '@/pages/documentos/DocumentosPage';
import UsersPage from '@/pages/users/UsersPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/processos" element={<ProcessosListPage />} />
            <Route path="/processos/novo" element={<ProcessoFormPage />} />
            <Route path="/processos/:id" element={<ProcessoDetailPage />} />
            <Route path="/processos/:id/editar" element={<ProcessoFormPage />} />
            <Route path="/clientes" element={<ClientesListPage />} />
            <Route path="/clientes/novo" element={<ClienteFormPage />} />
            <Route path="/clientes/:id/editar" element={<ClienteFormPage />} />
            <Route path="/prazos" element={<PrazosListPage />} />
            <Route path="/prazos/novo" element={<PrazoFormPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/financeiro/novo" element={<LancamentoFormPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
