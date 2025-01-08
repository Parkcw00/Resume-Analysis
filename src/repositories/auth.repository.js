import Prisma from '@prisma/client';

class AuthRepository {
  #orm;
  constructor(orm) {
    this.#orm = orm;
  }

  findUser = async (email) => this.#orm.user.findUnique({ where: { email } });

  signUp = async ({ email, password, name }) => {
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);
    await this.#orm.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  };
}

export default new AuthRepository(Prisma);
