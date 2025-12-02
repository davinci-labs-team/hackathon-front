import { SubmissionDTO } from "@/types/submission";
import { TeamDTO } from "@/types/team";


export function completeSubmission(rawSubmission: SubmissionDTO, teams: TeamDTO[]): SubmissionDTO {
    let submission = { ...rawSubmission };
    const team = teams.find(t => t.id === submission.teamId);
    if (team) {
        submission.teamName = team.name;
        submission.subjectId = team.subjectId;
        submission.juries = team.juries;
        submission.mentors = team.mentors;
    }
    if (submission.evaluations) {
        submission.evaluations = submission.evaluations.map(evaluation => {
            const jury = submission.juries.find(j => j.id === evaluation.juryId);
            if (jury) {
                evaluation.juryName = `${jury.firstname} ${jury.lastname}`;
            }
            return evaluation;
        });
    }
    if (submission.comments) {
        submission.comments = submission.comments.map(comment => {
            const mentor = submission.mentors.find(m => m.id === comment.mentorId);
            if (mentor) {
                comment.mentorName = `${mentor.firstname} ${mentor.lastname}`;
            }
            return comment;
        });
    }
    return submission;
}