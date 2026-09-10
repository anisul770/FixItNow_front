"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { loginAction } from "../_actions/authActions"

const LoginForm = () => {
    const [state, action, pending] = useActionState(loginAction, false);

    useEffect(() => {
        if (!state) return;

        console.log("loginAction state:", state);

        if (state.success) {
            toast.success(state.message ?? "Logged in successfully.");
        } else {
            toast.error(state.message ?? "Login failed. Please try again.");
        }
    }, [state]);

    return (
        <form action={action} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    minLength={4}
                    required
                />
            </div>

            <div className="flex items-center gap-2.5">
                <Checkbox id="remember" name="remember" />
                <Label
                    htmlFor="remember"
                    className="text-sm font-normal text-muted-foreground"
                >
                    Keep me logged in for 30 days
                </Label>
            </div>

            <Button type="submit" size="lg" className="w-full">
                {
                    pending ? "Submitting..." : "Login"
                }
            </Button>
        </form>
    )
}

export default LoginForm;