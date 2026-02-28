import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Gavel, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary-900 p-12">
        <div className="flex items-center gap-3">
          <Gavel className="h-9 w-9 text-primary-300" />
          <span className="text-2xl font-bold text-white">LexManager Pro</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Gestão jurídica<br />inteligente e segura
          </h2>
          <p className="text-primary-300 text-lg">
            Processos, prazos, financeiro e documentos<br />em um único lugar.
          </p>
        </div>
        <p className="text-primary-500 text-sm">LexManager Pro © 2025</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Gavel className="h-7 w-7 text-primary-700" />
            <span className="text-xl font-bold text-primary-900">LexManager Pro</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Entrar na sua conta</h1>
          <p className="text-sm text-gray-500 mb-8">
            Novo aqui?{' '}
            <Link to="/cadastro" className="text-primary-700 font-medium hover:underline">
              Crie seu escritório
            </Link>
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="seu@email.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="form-label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
