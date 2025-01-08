import resumeService from '../services/resumes.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class ResumeController {
  #serv;
  constructor(serv) {
    this.#serv = serv;
  }

  createResume = async (req, res) => {
    const user = req.user;
    const { title, content } = req.body;
    const authorId = user.id;
    const data = await this.#serv.createResume({ authorId, title, content });
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RESUMES.CREATE.SUCCEED,
      data,
    });
  };
  getResume = async (req, res) => {
    const user = req.user;
    const authorId = user.id;
    let { sort } = req.query;
    const data = await this.#serv.createResume({ authorId, sort });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data,
    });
  };
  getDetailResume = async (req, res) => {
    const user = req.user;
    const authorId = user.id;
    const { id } = req.params;
    const data = await this.#serv.getDetailResume({ authorId, id });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data,
    });
  };

  putResume = async (req, res) => {
    const user = req.user;
    const authorId = user.id;
    const { id } = req.params;
    const { title, content } = req.body;
    const data = await this.#serv.putResume({ authorId, id, title, content });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.SUCCEED,
      data,
    });
  };
  deleteResume = async (req, res) => {
    const user = req.user;
    const authorId = user.id;
    const { id } = req.params;
    const data = await this.#serv.putResume({ authorId, id });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.DELETE.SUCCEED,
      data: { id: data.id },
    });
  };
}
export default new ResumeController(resumeService);
