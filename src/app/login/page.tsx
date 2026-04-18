import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <AuthForm mode="login" />
    </div>
  );
}
