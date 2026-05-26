// src/components/auth/LoginPage.jsx
import { useState }     from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { login }        from '../../api/auth.api';
import toast            from 'react-hot-toast';

export default function LoginPage() {
  const { slug }           = useParams();
  const navigate           = useNavigate();
  const { login: authLogin, setLoading } = useAuthStore();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoading(true);
    try {
      const { access_token, user } = await login(email, password);
      authLogin(access_token, user);
      navigate(`/studio/${slug}`);
    } catch (err) {
      toast.error(err.response?.data?.detail ?? 'Identifiants invalides');
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <span className="login-card__logo-mark">◈</span>
          <span className="login-card__logo-text">Skin Studio</span>
        </div>
        <h1 className="login-card__title">Connexion</h1>
        <p className="login-card__sub">Portfolio : <strong>{slug}</strong></p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-form__label">
            Email
            <input
              type="email"
              className="login-form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="login-form__label">
            Mot de passe
            <input
              type="password"
              className="login-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
