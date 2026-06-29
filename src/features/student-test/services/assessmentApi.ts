// import { axiosClient } from "@/shared/lib/axiosClient";
import type {
  AssessmentAnswerPayload,
  AssessmentOption,
  AssessmentQuestion,
  StudentAssessment
} from "../types/assessment.types";

type BackendRecord = Record<string, unknown>;

function asRecord(value: unknown): BackendRecord {
  return value && typeof value === "object" ? (value as BackendRecord) : {};
}

function normalizeOption(option: unknown, index: number): AssessmentOption {
  const record = asRecord(option);
  const fallbackLabel = String.fromCharCode(65 + index);

  return {
    id: String(record.id ?? record.optionId ?? fallbackLabel.toLowerCase()),
    label: String(record.label ?? fallbackLabel),
    value: String(record.value ?? record.text ?? "")
  };
}

function normalizeQuestion(question: unknown, index: number): AssessmentQuestion {
  const record = asRecord(question);
  const options = Array.isArray(record.options) ? record.options : [];

  return {
    id: String(record.id ?? record.questionId ?? `question-${index + 1}`),
    instruction: String(record.instruction ?? "Read the question carefully and choose one option."),
    stimulus: record.stimulus ? String(record.stimulus) : "",
    question: String(record.question ?? record.questionText ?? ""),
    options: options.map(normalizeOption)
  };
}

function normalizeAssessment(payload: unknown, assessmentId: string): StudentAssessment {
  const source = asRecord(payload);
  const record = asRecord(source.response ?? source.data ?? payload);
  const questions = Array.isArray(record.questions) ? record.questions : [];
  const student = asRecord(record.student);

  return {
    id: String(record.id ?? assessmentId),
    attemptId: String(record.attemptId ?? record.id ?? assessmentId),
    title: String(record.title ?? "PARAKH LAT Assessment"),
    grade: String(record.grade ?? "Grade 6"),
    subject: String(record.subject ?? "Mathematics"),
    topic: record.topic ? String(record.topic) : "Numbers and Operations",
    durationMinutes: Number(record.durationMinutes ?? 45),
    student: {
      name: String(student.name ?? "Amit Kumar"),
      rollNumber: String(student.rollNumber ?? "23G6015")
    },
    questions: questions.map(normalizeQuestion)
  };
}

function createDummyAssessment(assessmentId: string): StudentAssessment {
  const questions: AssessmentQuestion[] = Array.from({ length: 30 }).map((_, index) => {
    const questionNumber = index + 1;

    return {
      id: `q${questionNumber}`,
      instruction: "Read the situation carefully and answer the question.",
      stimulus:
        questionNumber === 1
          ? "Riya has 24 apples. She gives 7 apples to her friend and 8 apples to her brother."
          : `A Grade 6 learner solves a competency-based Mathematics problem number ${questionNumber}.`,
      question:
        questionNumber === 1
          ? "How many apples are left with Riya?"
          : `Which option best answers question ${questionNumber}?`,
      options: [
        { id: "a", label: "A", value: questionNumber === 1 ? "8" : "Option 1" },
        { id: "b", label: "B", value: questionNumber === 1 ? "9" : "Option 2" },
        { id: "c", label: "C", value: questionNumber === 1 ? "10" : "Option 3" },
        { id: "d", label: "D", value: questionNumber === 1 ? "11" : "Option 4" }
      ]
    };
  });

  return normalizeAssessment(
    {
      id: assessmentId,
      attemptId: `attempt-${assessmentId}`,
      title: "Grade 6 Mathematics Assessment",
      grade: "Grade 6",
      subject: "Mathematics",
      topic: "Numbers and Operations",
      durationMinutes: 45,
      student: {
        name: "Amit Kumar",
        rollNumber: "23G6015"
      },
      questions
    },
    assessmentId
  );
}

function delay(ms = 300) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export const assessmentApi = {
  async getAssessment(assessmentId: string) {
    // Real API:
    // const response = await axiosClient.get<unknown>(`/student/assessments/${assessmentId}`);
    // return normalizeAssessment(response.data, assessmentId);

    await delay();
    return createDummyAssessment(assessmentId);
  },

  async saveAttempt(attemptId: string, payload: AssessmentAnswerPayload) {
    // Real API:
    // const response = await axiosClient.post(`/student/attempts/${attemptId}/save`, payload);
    // return response.data;

    await delay(150);
    return { ok: true, attemptId, savedAnswers: payload.answers.length };
  },

  async submitAttempt(attemptId: string, payload: AssessmentAnswerPayload) {
    // Real API:
    // const response = await axiosClient.post(`/student/attempts/${attemptId}/submit`, payload);
    // return response.data;

    await delay(250);
    return { ok: true, attemptId, submittedAnswers: payload.answers.length };
  }
};
