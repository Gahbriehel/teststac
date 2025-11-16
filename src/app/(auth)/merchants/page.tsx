"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, type JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { passwordValidation } from "@/components/helpers/passwordValidation";
import { Input } from "@/components/FormElements/Input";
import { Checkbox } from "@/components/FormElements/Checkbox";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";

interface Inputs {
  email: string;
  password: string;
  staySignedIn: boolean;
}

export default function Login(): JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password",
  );

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Enter Email"),
    password: passwordValidation,
    staySignedIn: yup.boolean().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { email: "", password: "", staySignedIn: false },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: Inputs): Promise<void> {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        staySignedIn: data.staySignedIn,
      };
      console.log("Login payload:", payload);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 p-4">
      <div className="max-w-[542px] max-h-[627px] m-auto w-full flex flex-col">
        <div className="bg-white p-12 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-[#52525B]">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="jane.doe@gmail.com"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password"
                  type={showPassword}
                  error={errors.password?.message}
                  hidePassword={() => setShowPassword("password")}
                  showPassword={() => setShowPassword("text")}
                  password
                />
              )}
            />

            <div className="flex items-center justify-between">
              <Controller
                name="staySignedIn"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    id="staySignedIn"
                    label="Stay signed in for a week"
                    checked={field.value}
                    onChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#242440] text-white py-2 rounded-md hover:bg-[#3f3f77] cursor-pointer"
            >
              Continue
            </Button>
          </form>
          <Link
            href="#"
            className="mt-4 block text-center text-sm text-[#242440] hover:underline"
          >
            Validate your new account
          </Link>
        </div>
        <div className="p-2 px-6">
          <p className="mt-4 text-sm text-[#52525B]">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-black hover:underline">
              Book a session first
            </Link>
          </p>

          <div className="mt-2 flex gap-2 text-xs text-gray-500">
            <Link href="#">© Getstac</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Privacy & terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
