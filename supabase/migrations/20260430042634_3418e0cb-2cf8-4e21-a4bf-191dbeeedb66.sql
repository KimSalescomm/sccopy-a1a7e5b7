-- 임시: default state 박제용 저장 테이블
CREATE TABLE public.default_state_dump (
  id BIGSERIAL PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.default_state_dump ENABLE ROW LEVEL SECURITY;

-- 익명 사용자도 INSERT 가능 (임시 박제 작업용)
CREATE POLICY "anyone can insert dump"
ON public.default_state_dump
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 읽기는 굳이 클라이언트가 필요 없음. (제가 service role로 읽음)
CREATE POLICY "anyone can select dump"
ON public.default_state_dump
FOR SELECT
TO anon, authenticated
USING (true);