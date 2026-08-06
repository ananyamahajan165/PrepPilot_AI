import jobs from "../data/jobs.json" with { type: "json" };

class JobService {
  getJobs() {
    return jobs;
  }

  getJob(id) {
    return jobs.find(
      (job) => job.id === Number(id)
    );
  }

  calculateMatch(job, resumeText) {
    let matched = [];

    job.skills.forEach((skill) => {
      if (
        resumeText
          .toLowerCase()
          .includes(skill.toLowerCase())
      ) {
        matched.push(skill);
      }
    });

    const score = Math.round(
      (matched.length / job.skills.length) * 100
    );

    return {
      company: job.company,
      role: job.role,
      matchScore: score,
      matchedSkills: matched,
      missingSkills: job.skills.filter(
        (skill) => !matched.includes(skill)
      ),
    };
  }
}

export default new JobService();
