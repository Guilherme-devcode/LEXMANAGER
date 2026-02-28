import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Gavel, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { registerTenant } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nomeTenant: '',
    emailTenant: '',
    nomeUsuario: '',
    emailUsuario: '',
    senha: '',
    cnpj: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await registerTenant({
        nomeTenant: form.nomeTenant,
        emailTenant: form.emailTenant,
        nomeUsuario: form.nomeUsuario,
        emailUsuario: form.emailUsuario,
        senha: form.senha,
        cnpj: form.cnpj || undefined,
      });
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Erro ao criar cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8">
          <Gavel className="h-7 w-7 text-primary-700" />
          <span className="text-xl font-bold text-primary-900">LexManager Pro</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar seu escritório</h1>
        <p className="text-sm text-gray-500 mb-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary-700 font-medium hover:underline">
            Entrar
          </Link>
        </p>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Dados do escritório</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="form-label">Nome do escritório *</label>
                  <input type="text" className="form-input" required {...field('nomeTenant')} />
                </div>
                <div>
                  <label className="form-label">Email do escritório *</label>
                  <input type="email" className="form-input" required {...field('emailTenant')} />
                </div>
                <div>
                  <label className="form-label">CNPJ</label>
                  <input type="text" className="form-input" placeholder="00.000.000/0001-00" {...field('cnpj')} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Dados do sócio administrador</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="form-label">Nome completo *</label>
                  <input type="text" className="form-input" required {...field('nomeUsuario')} />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" required {...field('emailUsuario')} />
                </div>
                <div>
                  <label className="form-label">Senha *</label>
                  <input type="password" className="form-input" required minLength={8} {...field('senha')} />
                  <p className="mt-1 text-xs text-gray-400">Mín. 8 chars, 1 maiúscula, 1 minúscula, 1 número</p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Criando...
                </span>
              ) : (
                'Criar escritório'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
