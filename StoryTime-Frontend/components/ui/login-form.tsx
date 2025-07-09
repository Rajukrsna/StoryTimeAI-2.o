import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { login } from "@/api/login";
import React, { useState } from "react";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await login(email, password);
            console.log("Login response:", response);
            if (!response.success) {
                setError("Invalid credentials. Please try again.");
                return;
            }
            localStorage.setItem("userId", response._id);
            await new Promise((res) => setTimeout(res, 100));
            router.push("/homepage");
        } catch (error) {
            console.error("Login failed", error);
            setError("Login failed. Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="p-8 w-full max-w-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 shadow-xl rounded-3xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form className="flex flex-col gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="text-base"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                <a href="#" className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-base"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                        <Button 
                            onClick={handleLogin} 
                            type="button" 
                            size="lg"
                            disabled={isLoading || !email || !password}
                            className="w-full py-4 text-base font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="lg"
                            className="w-full py-4 text-base font-semibold"
                        >
                            Continue with Google
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}