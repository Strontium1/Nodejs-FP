import { ObjectId, Types } from 'mongoose'
import UserModel, { User } from '../models/user.model'
import { encrypt } from '../encryption'
import { generateToken } from '../utils/jwt'

interface ILoginPayload {
  email: string
  password: string
}

export const login = async (payload: ILoginPayload): Promise<string> => {
  var { email, password } = payload
  email = encrypt(email)
  const userByEmail = await UserModel.findOne({
    email
  })
  if (!userByEmail) {
    return Promise.reject(new Error('Email or password is wrong.'))
  }

  const validatePassword: boolean = encrypt(password) === userByEmail.password

  if (!validatePassword) {
    return Promise.reject(new Error('Email or password is wrong.'))
  }

  const token = generateToken({
    id: userByEmail.id,
    username: userByEmail.username,
    roles: userByEmail.roles
  })

  return token
}

interface IRegisterPayload {
  email: string
  username: string
  password: string | undefined
  roles: (string | undefined) | undefined
  orders: string | undefined
}
export const register = async (payload: IRegisterPayload): Promise<User> => {
  const { email, username, password, roles, orders } = payload
  const user = await UserModel.create({
    email,
    password,
    username,
    roles,
    orders
  })

  return user
}

export const me = async (userId: string): Promise<User> => {
  const user = await UserModel.findById(userId)
  if (!user) {
    return Promise.reject(new Error('User not found'))
  }
  return user
}

export const updateProfile = async (userId: ObjectId, updateUserData: User) => {
  const result = await UserModel.findByIdAndUpdate(
    userId,
    {
      ...updateUserData
    },
    {
      new: true
    }
  )
  if (!result) {
    return Promise.reject(new Error('Failed to update user'))
  }
  return result
}
