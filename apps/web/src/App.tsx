import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ClienteFormPage from "@/pages/clientes/ClienteFormPage";
import ClientesListPage from "@/pages/clientes/ClientesListPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DocumentosPage from "@/pages/documentos/DocumentosPage";
import FinanceiroPage from "@/pages/financeiro/FinanceiroPage";
import LancamentoFormPage from "@/pages/financeiro/LancamentoFormPage";
import PrazoFormPage from "@/pages/prazos/PrazoFormPage";
import PrazosListPage from "@/pages/prazos/PrazosListPage";
import ProcessoDetailPage from "@/pages/processos/ProcessoDetailPage";
import ProcessoFormPage from "@/pages/processos/ProcessoFormPage";
import ProcessosListPage from "@/pages/processos/ProcessosListPage";
import UsersPage from "@/pages/users/UsersPage";
import { PrivateRoute } from "@/router/PrivateRoute";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider>
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
              <Route
                path="/processos/:id/editar"
                element={<ProcessoFormPage />}
              />
              <Route path="/clientes" element={<ClientesListPage />} />
              <Route path="/clientes/novo" element={<ClienteFormPage />} />
              <Route
                path="/clientes/:id/editar"
                element={<ClienteFormPage />}
              />
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
    </ThemeProvider>
  );
}
