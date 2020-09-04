import { Response, Request } from 'express'

export interface MyContext {
  req: Request & { session: Express.Session }
  res: Response
}

export interface GraphqlError {
  code: string
  detail: string
}
