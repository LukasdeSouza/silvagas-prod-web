-- Add foreign key relationship between sorteio_participants and profiles
ALTER TABLE public.sorteio_participants
ADD CONSTRAINT sorteio_participants_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;