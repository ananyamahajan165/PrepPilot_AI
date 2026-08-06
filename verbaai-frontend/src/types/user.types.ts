export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  college?: string;
  branch?: string;
  graduationYear?: number;
  bio?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  college?: string;
  branch?: string;
  graduationYear?: number;
  bio?: string;
}