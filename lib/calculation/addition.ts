import { AdditionProblem } from "../generator/addition";

export function verifyAdditionAnswer(problem: AdditionProblem, userAnswer: number): boolean {
  return problem.correctAnswer === userAnswer;
}

export function calculateScore(problems: AdditionProblem[], userAnswers: Record<string, number | null>) {
  let correct = 0;
  problems.forEach(p => {
    const answer = userAnswers[p.id];
    if (answer !== undefined && answer !== null && answer === p.correctAnswer) {
      correct++;
    }
  });
  return {
    correct,
    total: problems.length,
    percentage: problems.length > 0 ? (correct / problems.length) * 100 : 0
  };
}
