import z from 'zod'

const attributeSchema = z.object({
  user_id: z.string({
    invalid_type_error: 'user_id must be a string',
    required_error: 'user_id is required.'
  }),
    attribute_name: z.string({
    invalid_type_error: 'attribute_name must be a string',
    required_error: 'attribute_name is required.'
  }),
  attribute_value: z.string({
    invalid_type_error: 'attribute_value must be a string',
    required_error: 'attribute_value is required.'
  }),
})

export function validateAttribute (input) {
  return attributeSchema.safeParse(input)
}