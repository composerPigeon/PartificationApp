import type {SignUpState} from "../states/auth/SignUpState.ts";

import {serverProxy} from "../../services";
import {useNavigate} from "@tanstack/react-router";
import {useState, type SubmitEvent} from "react";

export function useSignUp(): SignUpState {
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSignUp(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        const form = event.currentTarget
        if (!form.checkValidity()) {
            form.reportValidity()
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await serverProxy.executeSignup(
                userName.trim().toLowerCase(),
                email.trim(),
                password,
            )

            if (!result.ok) {
                setError(result.error ?? 'Unable to create your account.')
                return
            }

            await navigate({ to: '/login' })
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Unable to create your account. Please try again.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const isIncomplete = Boolean(
        !userName.trim() ||
        !email.trim() ||
        !password ||
        !confirmPassword,
    )

    return {
        get userName() { return userName; },
        set userName(value: string) { setUserName(value); },
        get email() { return email; },
        set email(value: string) { setEmail(value); },
        get password() { return password; },
        set password(value: string) { setPassword(value); },
        get confirmPassword() { return confirmPassword; },
        set confirmPassword(value: string) { setConfirmPassword(value); },
        get error() { return error; },
        set error(value: string | null) { setError(value); },
        get isSubmitting() { return isSubmitting; },
        set isSubmitting(value: boolean) { setIsSubmitting(value); },
        get isIncomplete() { return isIncomplete; },
        handleSignUp
    }
}
