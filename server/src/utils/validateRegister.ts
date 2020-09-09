import { RegisterInput } from './RegisterInput'
import { FieldError } from '../resolvers/user'

export const validateRegister = (
  credentials: RegisterInput,
): FieldError[] | null => {
  const { username, email, password } = credentials

  if (username.trim().length < 4) {
    return [
      {
        field: 'username',
        message: 'length must be greater than 3',
      },
    ]
  }

  if (username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include an @',
      },
    ]
  }

  const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  if (!pattern.test(email.trim())) {
    return [
      {
        field: 'email',
        message: 'invalid email address',
      },
    ]
  }

  if (password.length < 6) {
    return [
      {
        field: 'password',
        message: 'length must be greater than 5',
      },
    ]
  }

  return null
}
