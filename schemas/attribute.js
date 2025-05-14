import z from 'zod'

const attributeSchema = z.object({
  user_id: z.string({
    invalid_type_error: 'user_id must be a string',
    required_error: 'user_id is required.'
  }),
  attributes: z.array(
    z.object({
      id: z.string({
        required_error: 'id is required',
        invalid_type_error: 'id must be a string'
      }).optional(),
      name: z.string({
        required_error: 'name is required',
        invalid_type_error: 'name must be a string'
      }),
      value: z.string({
        required_error: 'value is required',
        invalid_type_error: 'value must be a string'
      })
    }),
  )
})

const singleAttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string()
});

const singleAttributeCreateSchema = z.object({
  user_id: z.string({
    invalid_type_error: 'user_id must be a string',
    required_error: 'user_id is required.'
  }),
  attributes: z.object({
    name: z.string(),
    value: z.string()
  })

});

export const validateAttributeArray = (input) => {
  return z.array(singleAttributeSchema).safeParse(input);
};

export function validateAttribute(input) {
  return attributeSchema.safeParse(input)
}
export function validateSingleAttribute(input) {
  return singleAttributeCreateSchema.safeParse(input)
}
