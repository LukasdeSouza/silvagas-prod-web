-- Grant admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('b5ac271b-1105-4f9b-80ba-2367d6c78df4', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;