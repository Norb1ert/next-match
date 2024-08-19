"use server";
import bcrypt from "bcryptjs";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchems";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";

export async function signInUser(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    console.log(result);

    return { status: "success", data: "Logged in" };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    } else {
      return { status: "error", error: "Something else went wrong" };
    }
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

//data has to be a register type
export async function registerUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    //Securing the parse
    const validated = registerSchema.safeParse(data);

    //Checking for any errors
    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    //Defining data
    const { name, email, password } = validated.data;

    //Hashing a password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Checking if user exists with same email
    const existingUser = await prisma.user.findUnique({ where: { email } });

    //throwing an error
    if (existingUser) return { status: "error", error: "User already exists" };

    //Creating new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });
    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getAuthUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  return userId;
}
