import CompanyService from "../services/company.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = CompanyService.getCompanies();

  res.status(200).json(
    new ApiResponse(
      200,
      "Companies fetched successfully",
      companies
    )
  );
});

export const getCompany = asyncHandler(async (req, res) => {
  const company = CompanyService.getCompany(req.params.name);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      "Company fetched successfully",
      company
    )
  );
});