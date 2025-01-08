import resumeRepository from '../repositories/resumes.repository.js';

class ResumeService {
  #repo;
  constructor(repo) {
    this.#repo = repo;
  }

  createResume = async (resumeData) => {
    return await this.#repo.createResume(resumeData);
  };

  getResume = async (resumeData) => {
    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }

    const resumes = await this.#repo.getResumes({ resumeData });
    return resumes.map((resume) => {
      return {
        id: resume.id,
        authorName: resume.author.name,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });
  };

  getDetailResume = async (resumeData) => {
    const data = await this.#repo.getDetailResume({ resumeData });
    if (!data) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    return data.map((resume) => ({
      id: resume.id,
      authorName: resume.author.name,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }));
  };

  putResume = async (resumeData) => {
    let existedResume = await this.#repo.getDetailResume({ resumeData });

    // existedResume 값이 존재하지 않는다면 존재하지 않다는 상태코드와 이력서를 찾을 수 없다는 메시지를 반환합니다.
    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }
    return await this.#repo.putResume(resumeData);
  };
  deleteResume = async (resumeData) => {
    let existedResume = await this.#repo.getDetailResume({ resumeData });

    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }
    return await this.#repo.deleteResume(resumeData);
  };
}

export default new ResumeService(resumeRepository);
