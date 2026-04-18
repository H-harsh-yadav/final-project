"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "../icons/GoogleIcon";

const getFormSchema = (mode: "login" | "signup") => z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (mode === "signup" && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
  }
});

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const formSchema = getFormSchema(mode);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please log in instead.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password. Please try again.";
      case "auth/weak-password":
        return "Password is too weak. Please use a stronger password.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      default:
        return error.message || "An unknown error occurred.";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        
        // Setup initial user data in Firestore database
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
          email: values.email,
          createdAt: new Date().toISOString(),
          role: "user"
        });

        toast({
          title: "Account created",
          description: "You have been successfully signed up.",
        });
        router.push("/");
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: "Logged in",
          description: "Welcome back!",
        });
        router.push("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Store Google user data if it's their first time logging in
      const userDocRef = doc(firestore, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          createdAt: new Date().toISOString(),
          role: "user"
        });
      }

      toast({
        title: "Logged in with Google",
        description: "You have been successfully logged in.",
      });
      router.push("/");
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast({
          variant: "destructive",
          title: "Google Sign-In failed",
          description: getErrorMessage(error),
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleForgotPassword() {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { type: "manual", message: "Please enter your email address to reset password." });
      return;
    }
    
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for a password reset link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: getErrorMessage(error),
      });
    } finally {
      setIsResettingPassword(false);
    }
  }

  const title = mode === "login" ? "Welcome Back" : "Create an Account";
  const description =
    mode === "login"
      ? "Enter your credentials to access your account."
      : "Enter your details to create a new account.";
  const buttonText = mode === "login" ? "Login" : "Sign Up";

  return (
    <Card className="w-full max-w-sm shadow-xl border-muted/60 bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full relative overflow-hidden transition-all hover:bg-muted/50"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}{" "}
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 px-2 text-muted-foreground backdrop-blur-sm">
              Or continue with email
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      type="email" 
                      disabled={isLoading || isGoogleLoading} 
                      className="transition-colors focus-visible:ring-primary/50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    {mode === "login" && (
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 py-0 h-auto text-xs font-normal text-muted-foreground hover:text-primary transition-colors"
                        onClick={handleForgotPassword}
                        disabled={isResettingPassword || isLoading || isGoogleLoading}
                      >
                        {isResettingPassword ? "Sending..." : "Forgot password?"}
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      disabled={isLoading || isGoogleLoading} 
                      className="transition-colors focus-visible:ring-primary/50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "signup" && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        disabled={isLoading || isGoogleLoading} 
                        className="transition-colors focus-visible:ring-primary/50"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 transition-all font-medium" 
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 mt-2 pt-0 pb-6">
        <div className="text-sm text-center text-muted-foreground">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium transition-colors">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium transition-colors">
                Log in
              </Link>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
