import { SubmissionDTO } from "@/types/submission";
import { SubmissionStatus } from "@/types/submission_status";
import { UserReducedDTO } from "@/types/user";

export enum UserRole {
  JURY = 'JURY',
  MENTOR = 'MENTOR',
}

export const mockedSubmissions: SubmissionDTO[] = [
  // --- 1️⃣ Not Submitted ---
  {
    id: "11111111-1111-1111-1111-111111111111",
    teamId: "team-001",
    teamName: "Team Alpha",
    subjectId: "1c6f9d3b-3b89-4a9f-bde3-0c7a1c0f1a12", // Drug Discovery
    juries: [
      {
        id: "jury-001",
        firstname: "Alice",
        lastname: "Durand",
        school: "HEC",
        role: UserRole.JURY,
      },
      {
        id: "jury-002",
        firstname: "Bob",
        lastname: "Martin",
        school: "CentraleSupélec",
        role: UserRole.JURY,
      },
    ],
    mentors: [
      {
        id: "mentor-001",
        firstname: "Claire",
        lastname: "Moreau",
        role: UserRole.MENTOR,
        school: "INSA",
      },
    ],
    status: SubmissionStatus.NOT_SUBMITTED,
    grade: null,
    evaluations: [],
    comments: [],
    submissionFilePath: null,
    githubLink: null,
    createdAt: new Date("2025-11-01T10:00:00Z"),
    updatedAt: new Date("2025-11-01T10:00:00Z"),
  },

  // --- 2️⃣ Pending ---
  {
    id: "22222222-2222-2222-2222-222222222222",
    teamId: "team-002",
    teamName: "Team Beta",
    subjectId: "5b6f7c8d-9a0b-4c2e-92f3-6a8b7d4e1c29", // Energy Optimization
    juries: [
      {
        id: "jury-003",
        firstname: "David",
        lastname: "Roux",
        school: "ESSEC",
        role: UserRole.JURY,
      },
      {
        id: "jury-004",
        firstname: "Emma",
        lastname: "Blanc",
        school: "Mines Paris",
        role: UserRole.JURY,
      },
    ],
    mentors: [
      {
        id: "mentor-002",
        firstname: "Fabien",
        lastname: "Lopez",
        role: UserRole.MENTOR,
        school: "UTC",
      }
    ],
    status: SubmissionStatus.PENDING,
    grade: null,
    submissionFilePath: null,
    githubLink: null,
    
    evaluations: [
      {
        id: "eval-001",
        submissionId: "22222222-2222-2222-2222-222222222222",
        juryId: "jury-003",
        juryName: "David Roux",
        grade: 13.5,
        comment: "Bonne approche, encore des points à préciser sur la méthodologie.",
        evaluationFilePath: "https://static.islcollective.com/storage/preview/201103/766x1084/speech-evaluation-grid_4297_1.jpg",
        createdAt: new Date("2025-11-03T09:00:00Z"),
      },
    ],
    
    comments: [
      {
        id: "comm-001",
        submissionId: "22222222-2222-2222-2222-222222222222",
        mentorId: "mentor-002",
        mentorName: "Fabien Lopez",
        content: "Continuez comme ça, bon potentiel d’amélioration.",
        createdAt: new Date("2025-11-03T09:30:00Z"),
      },
    ],

    createdAt: new Date("2025-11-02T10:00:00Z"),
    updatedAt: new Date("2025-11-03T09:30:00Z"),
  },

  // --- 3️⃣ Graded ---
  {
    id: "33333333-3333-3333-3333-333333333333",
    teamId: "team-003",
    teamName: "Team Gamma",
    subjectId: "9f0a1b2c-3d4e-5f6b-96f7-0f1a2b8c6d73", // Route Planning for Logistics
    juries: [
      {
        id: "jury-005",
        firstname: "Hugo",
        lastname: "Petit",
        school: "ENS",
        role: UserRole.JURY,
      },
      {
        id: "jury-006",
        firstname: "Inès",
        lastname: "Garcia",
        school: "Télécom Paris",
        role: UserRole.JURY,
      },
    ],
    mentors: [
       {
        id: "mentor-005",
        firstname: "Laura",
        lastname: "Fournier",
        role: UserRole.MENTOR,
        school: "ENSTA",
      }
    ],
    status: SubmissionStatus.GRADED,
    grade: 16.25,
    submissionFilePath: null,
    githubLink: null,

    evaluations: [
      {
        id: "eval-002",
        submissionId: "33333333-3333-3333-3333-333333333333",
        juryId: "jury-005",
        juryName: "Hugo Petit",
        grade: 17,
        comment: "Projet très bien structuré, démonstration convaincante.",
        evaluationFilePath: "https://i.ytimg.com/vi/AElLUXB8mPc/maxresdefault.jpg",
        createdAt: new Date("2025-11-05T10:00:00Z"),
      },
      {
        id: "eval-003",
        submissionId: "33333333-3333-3333-3333-333333333333",
        juryId: "jury-006",
        juryName: "Inès Garcia",
        grade: 15.5,
        comment: "Excellent rendu, belle application des concepts quantiques.",
        evaluationFilePath: "https://d1ymz67w5raq8g.cloudfront.net/Pictures/1024x536/8/1/0/134810_self-assessment_MCQ_anwer_grid_image--1-.jpg",
        createdAt: new Date("2025-11-05T10:05:00Z"),
      },
    ],
    
    comments: [
      {
        id: "comm-002",
        submissionId: "33333333-3333-3333-3333-333333333333",
        mentorId: "mentor-005",
        mentorName: "Laura Fournier",
        content: "Très bonne progression, équipe investie. Félicitations ! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        createdAt: new Date("2025-11-05T11:00:00Z"),
      },
    ],

    createdAt: new Date("2025-11-04T09:00:00Z"),
    updatedAt: new Date("2025-11-05T11:00:00Z"),
  },
  
  // --- 4️⃣ Pending (No submission file) ---
  {
    id: "44444444-4444-4444-4444-444444444444",
    teamId: "team-004",
    teamName: "Team Delta",
    subjectId: "7d8f9a0b-1c2d-4e3f-94f5-8d0e9f6a4b51",
    juries: [
      {
        id: "jury-007",
        firstname: "Sophie",
        lastname: "Lemoine",
        school: "ESCP",
        role: UserRole.JURY,
      },
      {
        id: "jury-008",
        firstname: "Marc",
        lastname: "Dubois",
        school: "Polytechnique",
        role: UserRole.JURY,
      },
    ],
    mentors: [
      {
        id: "mentor-003",
        firstname: "Nina",
        lastname: "Bernard",
        role: UserRole.MENTOR,
        school: "UTC",
      }
    ],  
    status: SubmissionStatus.PENDING,
    grade: null,
    evaluations: [],
    comments: [],
    submissionFilePath: null,
    githubLink: null,
    createdAt: new Date("2025-11-06T10:00:00Z"),
    updatedAt: new Date("2025-11-06T10:00:00Z"),
  },  
]