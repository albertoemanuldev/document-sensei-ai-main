import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#eaf1f8]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#eaf1f8] p-4">
      <div className="flex flex-col items-center mb-8">
        <img src="/sotero-logo.png" alt="Logo Sotero" className="w-48 h-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-1">Analisador de Documentos</h1>
        <p className="text-gray-600 text-base md:text-lg">Faça login para conversar com seus documentos</p>
      </div>
      <div className="max-w-md w-full mx-auto">
        <AuthForm />
      </div>
      <footer className="w-full text-center mt-12 text-gray-500 text-sm">
        Desenvolvido por: <span className="font-semibold text-[#0A2540]">Alberto Emanuel e Adrylan Viana</span> © 2025. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Auth;
