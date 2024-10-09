import { Question } from "@src/entities/question.entity.js";
import { FastifyInstance } from "fastify";

const QuestionController = async (fastify: FastifyInstance) => {
  fastify.get("/", {}, async (request) => {
    const em = request.em;

    const questions = await em.find(Question, {});

    return questions;
  });
};

export default QuestionController;
