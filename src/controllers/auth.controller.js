import authService from '../services/auth.service.js';

class AuthController {
  #serv;
  constructor(serv) {
    this.#serv = serv;
  }

  signUp = async (req, res) => {
    const { email, password, name } = req.body;
    const data = await this.#serv.signUp({ email, password, name });
    data.password = undefined;
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data,
    });
  };

  signIn = async (req, res) => {
    //친구들아미안해
  };
}

export default new AuthController(authService);
