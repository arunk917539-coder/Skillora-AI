type interviewsType = {
  name: string;
  id: string;
  createdAt: Date;
  type: string;
  role: string;
  difficultyLevel: string;
  isCompleted: boolean | null;
  feedBack?: string | null;
}[];

export const FetchMockInterviews = async () => {
  const res = await fetch(`/api/interview/getall`);
  if (!res.ok) throw new Error("Could not load assessments. Please sign in again.");
  const data: interviewsType = await res.json();
  return Array.isArray(data) ? data.filter((x) => !x.isCompleted) : [];
};

export const FetchInterviewHistory = async () => {
  const res = await fetch(`/api/interview/getall`);
  if (!res.ok) throw new Error("Could not load assessment history. Please sign in again.");
  const data: interviewsType = await res.json();
  return Array.isArray(data) ? data.filter((x) => x.isCompleted) : [];
};
