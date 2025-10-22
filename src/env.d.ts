type User = {
  user?: any;
  role?: string;
};

declare namespace App {
  interface Locals {
    user: User["user"];
    role: User["role"];
  }
}
