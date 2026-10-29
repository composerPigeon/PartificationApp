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
        userName: {value: userName, set: setUserName},
        email: {value: email, set: setEmail},
        password: {value: password, set: setPassword},
        confirmPassword: {value: confirmPassword, set: setConfirmPassword},
        error: {value: error, set: setError},
        isSubmitting: {value: isSubmitting, set: setIsSubmitting},
        isIncomplete,
        handleSignUp
    }
}
