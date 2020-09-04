import { GraphqlError } from '../types'

export const errorHandlers = (err: GraphqlError) => {
  let errors

  // duplicate username error
  // err.code === '23505' && err.detail.includes('email')
  if (err.code === '23505') {
    const field = err.detail.match(/\(.*?\)/)![0].replace(/[()]/g, '')

    errors = [
      {
        field,
        message: `${field} already taken`,
      },
    ]
  }

  return { errors }
}
