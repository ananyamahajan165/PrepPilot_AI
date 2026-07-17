import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../contexts/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);

      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to continue using VerbaAI
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.email?.message}
            </p>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="relative">

              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full border rounded-xl p-3 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4"
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>

            </div>

            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {isSubmitting
              ? "Signing In..."
              : "Login"}
          </button>

          <div className="text-center">

            <Link
              to="/forgot-password"
              className="text-indigo-600 text-sm"
            >
              Forgot Password?
            </Link>

          </div>

          <p className="text-center text-gray-600">

            Don't have an account?

            <Link
              to="/register"
              className="text-indigo-600 font-semibold ml-2"
            >
              Register
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;
