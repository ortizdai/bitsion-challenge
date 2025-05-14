import z from 'zod'

const adminSchema = z.object({
  username: z.string({
    invalid_type_error: 'username must be a string',
    required_error: 'username is required.'
  }),
  email: z.string({
    invalid_type_error: 'email must be a string',
    required_error: 'email is required.'
  }),
  full_name: z.string({
    invalid_type_error: 'full_name must be a string',
    required_error: 'full_name is required.'
  }),
  password: z.string({
    invalid_type_error: 'password must be a string',
    required_error: 'password is required.'
  }).min(8, { message: 'Password must be at least 8 characters long' }),
})

export function validateAdmin(input) {
  return adminSchema.safeParse(input)
}
export function validatePartialAdmin(input) {
  return adminSchema.partial().safeParse(input)
}
export const validateAdminLogin = (data) => {
  const loginSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    password: z.string().min(6, 'Password is required'),
  });

  return loginSchema.safeParse(data);
};