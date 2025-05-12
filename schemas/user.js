import z from 'zod'

const userSchema = z.object({
    full_name: z.string({
    invalid_type_error: 'full_name must be a string',
    required_error: 'full_name is required.'
  }),
  age: z.number().int(), // hay un rango de edad requerido?
  gender: z.string({
    invalid_type_error: 'full_name must be a string',
    required_error: 'full_name is required.'
  }),
  state: z.string().default('activo'),
  user_name: z.string({
    invalid_type_error: 'user_id must be a string',
    required_error: 'user_id is required.'
  }),
  identification: z.number().int().positive(), // hay un minimo y maximo de numeros?
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}