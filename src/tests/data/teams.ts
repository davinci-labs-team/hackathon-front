import { UserRole } from "@/types/roles";
import { TeamDTO } from "@/types/team";
import { TeamStatus } from "@/types/team_status";

const mockTeams: TeamDTO[] = [
  {
    id: "team1",
    name: "Team Alpha",
    description: "Une équipe sans jury",
    themeId: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // Quantum Computing for Healthcare
    subjectId: "1c6f9d3b-3b89-4a9f-bde3-0c7a1c0f1a12", // Drug Discovery
    status: TeamStatus.UNLOCKED,
    ignoreConstraints: true,
    createdAt: "2025-10-19T10:00:00Z",
    members: [
      {
        id: "user1",
        firstname: "Alice",
        lastname: "Dupont",
        school: "EPITA",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user2",
        firstname: "Bob",
        lastname: "Martin",
        school: "Université de Tours",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user3",
        firstname: "Charlie",
        lastname: "Nguyen",
        school: "ISG Paris Business School",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user4",
        firstname: "David",
        lastname: "Leclerc",
        school: "EPITA",
        role: UserRole.PARTICIPANT
      }
    ],
    juries: [],
    mentors: [
      {
        id: "mentor1",
        firstname: "Eva",
        lastname: "Moreau",
        school: "",
        role: UserRole.MENTOR
      }
    ]
  },
  {
    id: "team2",
    name: "Team Beta",
    description: "Une équipe sans mentor et sans ISG",
    themeId: "b72d9f0e-12c3-4b1e-9f3a-7a6d8b5c2e34", // Quantum Solutions for Environment
    subjectId: "4a5e6b7c-8d9f-4b3a-91e2-5f7c6a3d2b18", // Climate Modeling
    status: TeamStatus.UNLOCKED,
    ignoreConstraints: false,
    createdAt: "2025-10-19T11:00:00Z",
    members: [
      {
        id: "user5",
        firstname: "Fiona",
        lastname: "Petit",
        school: "Université de Sherbrooke",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user6",
        firstname: "George",
        lastname: "Durand",
        school: "Université de Tours",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user7",
        firstname: "Hana",
        lastname: "Khan",
        school: "EPITA",
        role: UserRole.PARTICIPANT
      }
    ],
    juries: [
      {
        id: "jury1",
        firstname: "Isabelle",
        lastname: "Robert",
        school: "",
        role: UserRole.JURY
      }
    ],
    mentors: []
  },
  {
    id: "team3",
    name: "Team Gamma",
    description: "Une équipe avec moins de 3 membres, sans étudiant EPITA",
    themeId: "c83e0f1a-23b4-4c2d-9f5b-8c0d9e6f3b41", // Quantum Computing for Transportation
    subjectId: "7d8f9a0b-1c2d-4e3f-94f5-8d0e9f6a4b51", // Traffic Flow Optimization
    status: TeamStatus.UNLOCKED,
    ignoreConstraints: false,
    createdAt: "2025-10-19T12:00:00Z",
    members: [
      {
        id: "user8",
        firstname: "Ian",
        lastname: "Lemoine",
        school: "Université de Sherbrooke",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user9",
        firstname: "Julia",
        lastname: "Caron",
        school: "ISG Paris Business School",
        role: UserRole.PARTICIPANT
      }
    ],
    juries: [
      {
        id: "jury2",
        firstname: "Kevin",
        lastname: "Benoit",
        school: "",
        role: UserRole.JURY
      }
    ],
    mentors: [
      {
        id: "mentor2",
        firstname: "Laura",
        lastname: "Fournier",
        school: "",
        role: UserRole.MENTOR
      }
    ]
  },
  {
    id: "team4",
    name: "Team Delta",
    description: "Une équipe complète avec jury, mentor et diversité académique",
    themeId: "b72d9f0e-12c3-4b1e-9f3a-7a6d8b5c2e34", // Quantum Solutions for Environment
    subjectId: "5b6f7c8d-9a0b-4c2e-92f3-6a8b7d4e1c29", // Energy Optimization
    status: TeamStatus.LOCKED,
    ignoreConstraints: false,
    createdAt: "2025-10-19T13:00:00Z",
    members: [
      {
        id: "user10",
        firstname: "Lucas",
        lastname: "Bernard",
        school: "Université de Sherbrooke",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user11",
        firstname: "Marie",
        lastname: "Gauthier",
        school: "Université de Sherbrooke",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user12",
        firstname: "Nina",
        lastname: "Rossi",
        school: "EPITA",
        role: UserRole.PARTICIPANT
      },
      {
        id: "user13",
        firstname: "Omar",
        lastname: "Benali",
        school: "ISG Paris Business School",
        role: UserRole.PARTICIPANT
      }
    ],
    juries: [
      {
        id: "jury3",
        firstname: "Patrick",
        lastname: "Leblanc",
        school: "",
        role: UserRole.JURY
      }
    ],
    mentors: [
      {
        id: "mentor3",
        firstname: "Quentin",
        lastname: "Rousseau",
        school: "",
        role: UserRole.MENTOR
      }
    ]
  }
];

export default mockTeams;
