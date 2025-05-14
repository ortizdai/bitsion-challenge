import z from 'zod'

const userSchema = z.object({
    full_name: z.string({
    invalid_type_error: 'full_name must be a string',
    required_error: 'full_name is required.'
  }),
  age: z.number().int(), // Is there an age range required?
  gender: z.string({
    invalid_type_error: 'full_name must be a string',
    required_error: 'full_name is required.'
  }),
  state: z.string(),
  identification: z.number().int().positive(), // Is there a minimum and maximum number of digits for the identification?
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}