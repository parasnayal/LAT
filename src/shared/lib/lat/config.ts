export const GRADE_CONFIG = {
  "3": { totalQuestions: 45, duration: 90 },
  "6": { totalQuestions: 51, duration: 120 },
  "8": { totalQuestions: 60, duration: 150 }
} as const;

export const SUBJECT_DISTRIBUTION = {
  "3": { Hindi: 12, English: 11, Math: 12, EVS: 10 },
  "6": { Hindi: 9, English: 9, Math: 10, Science: 8, SST: 8, Sanskrit: 7 },
  "8": { Hindi: 11, English: 10, Math: 12, Science: 12, SST: 10, Sanskrit: 5 }
} as const;

export const COMPETENCIES = {
  Math: [
    "Integer Operations",
    "Fraction Applications",
    "Data Interpretation",
    "Geometry",
    "Measurement"
  ],
  Science: ["Weather", "Climate", "River Systems", "Soil Formation", "Living Things", "Human Body"],
  SST: ["Historical Changes", "Society Impact", "Geography Basics", "Civics Awareness"],
  Hindi: [
    "Reading Comprehension",
    "Grammar Application",
    "Vocabulary in Context",
    "Writing Skills"
  ],
  English: [
    "Reading Comprehension",
    "Grammar Application",
    "Vocabulary in Context",
    "Writing Skills"
  ],
  EVS: ["Environment Awareness", "Daily Life Science", "Plants and Animals"],
  Sanskrit: ["Reading Comprehension", "Grammar Application"]
} as const;

export const BASELINE_GRADE = { "3": "2", "6": "5", "8": "7" } as const;

export const SUBJECT_LANGUAGE = {
  Hindi: "Hindi",
  Sanskrit: "Sanskrit",
  English: "English",
  Math: "English",
  Science: "English",
  SST: "English",
  EVS: "English"
} as const;

export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 500;
