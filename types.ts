
export type UserRole = 'Owner' | 'Faculty' | 'Expert' | 'Student';

export interface SkillScores {
  network: number;
  crypto: number;
  programming: number;
  ai: number;
  appSec: number;
}

export interface UserStats {
  questionsAsked: number;
  answersGiven: number;
  verificationsReceived: number;
  karma: number;
}

export interface UserBadge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'Question' | 'Answer' | 'Contribution' | 'Project';
  title: string;
  timestamp: Date;
  category?: string;
  linkId?: string;
}

export interface User {
  id: string;
  email: string; // New: For Auth
  password?: string; // New: For simulation
  name: string;
  role: UserRole;
  avatar: string;
  karma: number;
  major: string;
  year?: number;
  stats?: UserStats;
  badges?: UserBadge[];
  skills?: string[];
  activity?: ActivityItem[];
  skillScores?: SkillScores; 
  completedRoadmapSteps?: string[]; 
  joinedProjects?: string[];
}

export type ResourceStatus = 'Approved' | 'Pending' | 'Rejected';
export type ResourceOrigin = 'Official' | 'Practical' | 'Community';

export interface CourseResource {
  id: string;
  name: string;
  type: 'Summary' | 'Project' | 'Video' | 'Explanation' | 'Tool' | 'Cert' | 'CTF';
  url: string;
  description?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  authorName: string;
  authorRole: UserRole;
  authorId: string;
  timestamp: Date;
}

export interface Course {
  id: string;
  title: string;
  category: 'Cybersecurity' | 'AI' | 'Engineering' | 'General';
  description: string;
  instructor: string;
  image: string;
  rating: number;
  students: number;
  year: 1 | 2 | 3 | 4;
  semester: 1 | 2;
  resources: CourseResource[];
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetTitle: string;
  targetType: 'Question' | 'Answer' | 'Resource' | 'Bug' | 'Complaint';
  reason: string;
  timestamp: Date;
  status: 'Pending' | 'Resolved';
}

export interface MeetingRequest {
  userId: string;
  userName: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardBadge: string;
  expiresAt: Date;
  winners: string[]; 
  meetingActive: boolean;
  meetingModeratorId?: string;
  joinRequests: MeetingRequest[];
}

export interface RoadmapStep {
  id: string;
  label: string;
  type: 'Course' | 'Certificate' | 'Project' | 'Skill';
  description: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: 'Cybersecurity' | 'AI';
  steps: RoadmapStep[];
  icon: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Answer {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  timestamp: Date;
  isVerified: boolean;
  upvotes: number;
}

export interface Question {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  text: string;
  category: string;
  timestamp: Date;
  answers: Answer[];
  isExpertRequired: boolean;
  isFeatured: boolean; 
  status: 'Answered' | 'Unanswered';
  tags?: string[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  proposerName: string;
  proposerId: string;
  proposerRole: UserRole;
  description: string;
  requiredSkills: string[];
  slots: number;
  filledSlots: number;
  category: 'Research' | 'Side Project' | 'Graduation';
  status: 'Open' | 'Full';
}
