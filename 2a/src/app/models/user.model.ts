export interface UserRegistration {
  fullName: string;
  email: string;
  phone: string;
  rollNo: string;
  course: string;
  password: string;
}

export interface User extends UserRegistration {
  id: string;
}
