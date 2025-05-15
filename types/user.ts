export interface User {
  _id: string;
  email: string;
  role: "Admin" | "Employee";
}
