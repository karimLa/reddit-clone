import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from 'type-graphql';
import argon2 from 'argon2';
import { MyContext } from '../types';
import { User } from '../entities/User';
import { COOKIE_NAME } from '../constants';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    const { userId } = req.session;

    if (!userId) {
      return null;
    }

    const user = await em.findOne(User, { id: userId });

    if (!user) {
      return null;
    }

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;

    if (username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'length must be greater than 2',
          },
        ],
      };
    }

    if (password.length <= 3) {
      return {
        errors: [
          {
            field: 'password',
            message: 'length must be greater than 3',
          },
        ],
      };
    }

    const userExists = await em.findOne(User, { username });

    if (userExists) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username is taken.',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);

    const user = em.create(User, { username, password: hashedPassword });

    await em.persistAndFlush(user);

    // Store user id session
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;

    const user = await em.findOne(User, { username });

    if (!user) {
      return {
        errors: [
          { field: 'username', message: "That username doesn't exist." },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'Incorrect password.' }],
      };
    }

    // Store user id session
    req.session.userId = user.id;

    return { user };
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise<boolean>((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }
}
