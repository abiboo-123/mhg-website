type User = {
  user?: any;
  user_id?: string;
  role?: "admin" | "super_admin" | "user";
};

declare namespace App {
  interface Locals {
    user: User["user"];
    user_id: User["user_id"];
    role: User["role"];
  }
}
