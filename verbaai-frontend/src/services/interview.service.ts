import API from "../lib/api";

export interface InterviewRequest {
  company: string;
  role: string;
  difficulty: string;
  type: string;
}

class InterviewService {
  async startInterview(data: InterviewRequest) {
    const response = await API.post(
      "/interviews/start",
      data
    );

    return response.data;
  }

  async submitAnswer(
    interviewId: string,
    answer: string
  ) {
    const response = await API.post(
      `/interviews/${interviewId}/answer`,
      {
        answer,
      }
    );

    return response.data;
  }

  async finishInterview(interviewId: string) {
    const response = await API.post(
      `/interviews/${interviewId}/finish`
    );

    return response.data;
  }

  async getInterviewHistory() {
    const response = await API.get(
      "/interviews/history"
    );

    return response.data;
  }

  async getInterviewById(id: string) {
    const response = await API.get(
      `/interviews/${id}`
    );

    return response.data;
  }

  async deleteInterview(id: string) {
    const response = await API.delete(
      `/interviews/${id}`
    );

    return response.data;
  }
}

export default new InterviewService();