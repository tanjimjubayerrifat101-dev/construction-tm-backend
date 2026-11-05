import { AppError } from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import {
  deleteFromCloudinary,
  uploadRawToCloudinary,
} from "../../utils/uploadImage";
import {
  IApplicationStatus,
  IJobApplication,
  IJobPosition,
} from "./career.interface";
import { JobApplication, JobPosition } from "./career.model";

export const formatLocalizedJobPosition = (
  job: IJobPosition,
  lang?: "en" | "ar" | string
) => {
  if (!lang || (lang !== "en" && lang !== "ar")) {
    return job;
  }

  const isAr = lang === "ar";
  const selectStr = (field?: { en: string; ar: string }) => {
    if (!field) return "";
    return isAr ? field.ar || field.en : field.en || field.ar;
  };

  const selectArr = (field?: { en: string[]; ar: string[] }) => {
    if (!field) return [];
    return isAr ? (field.ar?.length ? field.ar : field.en) : field.en?.length ? field.en : field.ar;
  };

  return {
    _id: job._id,
    id: job.jobId,
    jobId: job.jobId,
    title: selectStr(job.title),
    departmentId: job.departmentId,
    department: selectStr(job.department),
    location: selectStr(job.location),
    type: selectStr(job.type),
    experience: selectStr(job.experience),
    postedDate: job.postedDate,
    icon: job.icon,
    overview: selectStr(job.overview),
    responsibilities: selectArr(job.responsibilities),
    requirements: {
      education: selectArr(job.requirements?.education),
      experience: selectArr(job.requirements?.experience),
      licensing: selectArr(job.requirements?.licensing),
    },
    order: job.order,
    isActive: job.isActive,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
};

const createJobPosition = async (payload: Partial<IJobPosition>) => {
  const existing = await JobPosition.findOne({ jobId: payload.jobId });
  if (existing) {
    throw new AppError(400, `Job with ID '${payload.jobId}' already exists.`);
  }

  const job = await JobPosition.create(payload);
  return job;
};

const getAllJobPositions = async (
  query: Record<string, unknown>,
  lang?: string
) => {
  const filter: Record<string, unknown> = {};

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  if (query.departmentId && query.departmentId !== "all") {
    filter.departmentId = query.departmentId;
  }

  if (query.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm as string, "i");
    filter.$or = [
      { jobId: searchRegex },
      { "title.en": searchRegex },
      { "title.ar": searchRegex },
      { "department.en": searchRegex },
      { "department.ar": searchRegex },
      { "location.en": searchRegex },
      { "location.ar": searchRegex },
      { "overview.en": searchRegex },
      { "overview.ar": searchRegex },
    ];
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await JobPosition.countDocuments(filter);
  const jobs = await JobPosition.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: jobs.map((j) => formatLocalizedJobPosition(j, lang)),
  };
};

const getJobPositionByJobId = async (jobId: string, lang?: string) => {
  const job = await JobPosition.findOne({ jobId, isActive: true });
  if (!job) {
    throw new AppError(404, `Job position '${jobId}' not found.`);
  }
  return formatLocalizedJobPosition(job, lang);
};

const getJobPositionById = async (id: string) => {
  const job = await JobPosition.findById(id);
  if (!job) {
    throw new AppError(404, "Job position not found.");
  }
  return job;
};

const updateJobPosition = async (
  id: string,
  payload: Partial<IJobPosition>
) => {
  const job = await JobPosition.findById(id);
  if (!job) {
    throw new AppError(404, "Job position not found.");
  }

  if (payload.jobId && payload.jobId !== job.jobId) {
    const existing = await JobPosition.findOne({ jobId: payload.jobId });
    if (existing) {
      throw new AppError(400, `Job with ID '${payload.jobId}' already exists.`);
    }
  }

  const updated = await JobPosition.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updated;
};

const deleteJobPosition = async (id: string) => {
  const job = await JobPosition.findById(id);
  if (!job) {
    throw new AppError(404, "Job position not found.");
  }

  await JobPosition.findByIdAndDelete(id);
  return { message: "Job position deleted successfully." };
};

// ── Job Application Logic ──

const submitJobApplication = async (
  payload: Partial<IJobApplication>,
  file?: Express.Multer.File
) => {
  if (file) {
    const uploadResult = await uploadRawToCloudinary(
      file.buffer,
      "tmyazna/resumes",
      file.originalname
    );
    payload.cv = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      filename: file.originalname,
    };
  } else if (!payload.cv?.url) {
    throw new AppError(400, "Resume / CV document is required.");
  }

  const application = await JobApplication.create(payload);

  // Send candidate notification email if SMTP configured
  try {
    await sendEmail({
      to: application.email,
      subject: `Application Received - ${application.jobTitle} | TMYAZNA`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #001833;">Thank you for applying, ${application.fullName}!</h2>
          <p>We have successfully received your application for the <strong>${application.jobTitle}</strong> position at TMYAZNA Company Limited.</p>
          <p>Our talent acquisition team will review your qualifications and experience. If your profile matches our requirements, we will contact you for the next steps.</p>
          <br>
          <p>Best regards,<br><strong>TMYAZNA Careers Team</strong></p>
        </div>
      `,
    });
  } catch (err) {
    // Non-fatal if email fails
  }

  return application;
};

const getAllJobApplications = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query.jobId) {
    filter.jobId = query.jobId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm as string, "i");
    filter.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { jobTitle: searchRegex },
      { nationality: searchRegex },
      { currentCity: searchRegex },
    ];
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await JobApplication.countDocuments(filter);
  const applications = await JobApplication.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: applications,
  };
};

const updateApplicationStatus = async (
  id: string,
  status: IApplicationStatus
) => {
  const application = await JobApplication.findById(id);
  if (!application) {
    throw new AppError(404, "Application not found.");
  }

  application.status = status;
  await application.save();

  return application;
};

const deleteJobApplication = async (id: string) => {
  const application = await JobApplication.findById(id);
  if (!application) {
    throw new AppError(404, "Application not found.");
  }

  if (application.cv?.public_id) {
    await deleteFromCloudinary(application.cv.public_id);
  }

  await JobApplication.findByIdAndDelete(id);
  return { message: "Application deleted successfully." };
};

export const CareerService = {
  createJobPosition,
  getAllJobPositions,
  getJobPositionByJobId,
  getJobPositionById,
  updateJobPosition,
  deleteJobPosition,
  submitJobApplication,
  getAllJobApplications,
  updateApplicationStatus,
  deleteJobApplication,
};
