import authRepository from '../repositories/auth.repository.js';

class AuthService {
  #repo;
  constructor(repo) {
    this.#repo = repo;
  }

  signUp = async (userData) => {
    const existedUser = await this.#repo.findUser(email);

    if (existedUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: HTTP_STATUS.CONFLICT,
        message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED,
      });
    }
    return await this.#repo.signUp(userData);
  };

  signIn = async (email, password) => {
    //친구들아 미안해
  };
}

export default new AuthService(authRepository);
