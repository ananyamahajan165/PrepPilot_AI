import companies from "../data/companies.json" with { type: "json" };

class CompanyService {
  getCompanies() {
    return companies;
  }

  getCompany(name) {
    return companies.find(
      (company) =>
        company.name.toLowerCase() === name.toLowerCase()
    );
  }
}

export default new CompanyService();
