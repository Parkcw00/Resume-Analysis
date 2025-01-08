import Prisma from '@prisma/client';

class ResumeRepository {
  #orm;
  constructor(orm) {
    this.#orm = orm;
  }

  createResume = async ({ authorId, title, content }) => {
    return await this.#orm.resume.create({
      data: { authorId, title, content },
    });
  };

  getResume = async ({ authorId, sort }) => {
    return await this.#orm.resume.findMany({
      where: { authorId },
      orderBy: {
        createdAt: sort,
      },
      include: {
        author: true,
      },
    });
  };

  getDetailResume = async ({ authorId, id }) => {
    return await this.#orm.resume.findUnique({
      where: { id: +id, authorId },
      include: { author: true },
    });
  };

  putResume = async ({ authorId, id, title, content }) => {
    return await this.#orm.resume.update({
      where: { id: +id, authorId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });
  };

  deleteResume = async ({ authorId, id }) => {
    return await this.#orm.resume.delete({ where: { id: +id, authorId } });
  };
}

export default new ResumeRepository(Prisma);
