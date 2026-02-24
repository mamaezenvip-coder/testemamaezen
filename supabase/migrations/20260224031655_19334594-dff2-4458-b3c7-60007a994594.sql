
-- Tabela de chaves de licença
CREATE TABLE public.license_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de ativações
CREATE TABLE public.key_activations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  license_key_id UUID NOT NULL REFERENCES public.license_keys(id) ON DELETE CASCADE,
  device_id TEXT,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_activations ENABLE ROW LEVEL SECURITY;

-- Policies: qualquer autenticado pode ver chaves (para validar)
CREATE POLICY "Authenticated users can check keys"
  ON public.license_keys FOR SELECT
  TO authenticated
  USING (true);

-- Policies: ativações - usuário só vê a sua
CREATE POLICY "Users can view own activation"
  ON public.key_activations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activation"
  ON public.key_activations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Função para ativar chave
CREATE OR REPLACE FUNCTION public.activate_license_key(
  p_key TEXT,
  p_device_id TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key_id UUID;
  v_existing RECORD;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Verificar se usuário já tem ativação válida
  SELECT * INTO v_existing FROM key_activations WHERE user_id = auth.uid();
  IF v_existing IS NOT NULL AND v_existing.expires_at > now() THEN
    RETURN json_build_object('success', true, 'message', 'Already activated', 'expires_at', v_existing.expires_at);
  END IF;

  -- Buscar chave
  SELECT id INTO v_key_id FROM license_keys WHERE key = p_key AND is_used = false;
  IF v_key_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid or already used key');
  END IF;

  -- Marcar chave como usada
  UPDATE license_keys SET is_used = true WHERE id = v_key_id;

  -- Calcular expiração (360 dias)
  v_expires_at := now() + INTERVAL '360 days';

  -- Deletar ativação antiga se existir
  DELETE FROM key_activations WHERE user_id = auth.uid();

  -- Criar ativação
  INSERT INTO key_activations (user_id, license_key_id, device_id, activated_at, expires_at)
  VALUES (auth.uid(), v_key_id, p_device_id, now(), v_expires_at);

  RETURN json_build_object('success', true, 'message', 'Key activated successfully', 'expires_at', v_expires_at);
END;
$$;
