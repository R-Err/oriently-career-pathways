
-- Create quiz_submissions table to store all user data and responses
CREATE TABLE public.quiz_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  region TEXT,
  country TEXT DEFAULT 'Italy',
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL,
  profile_result JSONB NOT NULL,
  suggested_courses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster email lookups
CREATE INDEX idx_quiz_submissions_email ON public.quiz_submissions(email);
CREATE INDEX idx_quiz_submissions_created_at ON public.quiz_submissions(created_at);

-- Enable Row Level Security (RLS) - making data publicly readable for this use case
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for admin dashboard later)
CREATE POLICY "Allow public read access to quiz submissions" 
  ON public.quiz_submissions 
  FOR SELECT 
  USING (true);

-- Create policy to allow public insert (for quiz submissions)
CREATE POLICY "Allow public insert of quiz submissions" 
  ON public.quiz_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create italian_cities table for city mapping
CREATE TABLE public.italian_cities (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  region TEXT NOT NULL,
  country TEXT DEFAULT 'Italy',
  UNIQUE(city, province)
);

-- Insert sample Italian cities data
INSERT INTO public.italian_cities (city, province, region) VALUES
('Milano', 'MI', 'Lombardia'),
('Roma', 'RM', 'Lazio'),
('Napoli', 'NA', 'Campania'),
('Torino', 'TO', 'Piemonte'),
('Palermo', 'PA', 'Sicilia'),
('Genova', 'GE', 'Liguria'),
('Bologna', 'BO', 'Emilia-Romagna'),
('Firenze', 'FI', 'Toscana'),
('Bari', 'BA', 'Puglia'),
('Catania', 'CT', 'Sicilia'),
('Venezia', 'VE', 'Veneto'),
('Verona', 'VR', 'Veneto'),
('Messina', 'ME', 'Sicilia'),
('Padova', 'PD', 'Veneto'),
('Trieste', 'TS', 'Friuli-Venezia Giulia'),
('Taranto', 'TA', 'Puglia'),
('Brescia', 'BS', 'Lombardia'),
('Reggio Calabria', 'RC', 'Calabria'),
('Modena', 'MO', 'Emilia-Romagna'),
('Prato', 'PO', 'Toscana');

-- Enable RLS for cities table
ALTER TABLE public.italian_cities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to cities
CREATE POLICY "Allow public read access to italian cities" 
  ON public.italian_cities 
  FOR SELECT 
  USING (true);
