import type {SignUpState} from "./states/SignUpState.ts";

import {serverProxy} from "../../services";
import {useNavigate} from "@tanstack/react-router";
import {useState, type SubmitEvent} from "react";
import {useFormBase} from '../useFormBase.ts';

export function useSignUp(): SignUpState {
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const formState = useFormBase()
    formState.isIncomplete = !userName.trim() || !email.trim() || !password || !confirmPassword

    async function handleSignUp(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        await formState.submit(async () => {
            const form = event.currentTarget
            if (!form.checkValidity()) {
                form.reportValidity()
                return
            }
            if (password !== confirmPassword) {
                formState.error = 'Passwords do not match.'
                return
            }

            const result = await serverProxy.executeSignup(
                userName.trim().toLowerCase(),
                email.trim(),
                password,
            )

            if (!result.ok) {
                formState.error = result.error ?? 'Unable to create your account.'
                return
            }

            await navigate({ to: '/login' })
        }, 'Unable to create your account. Please try again.')
    }

    return formState.extend({
        get userName() { return userName; },
        set userName(value: string) { setUserName(value); },
        get email() { return email; },
        set email(value: string) { setEmail(value); },
        get password() { return password; },
        set password(value: string) { setPassword(value); },
        get confirmPassword() { return confirmPassword; },
        set confirmPassword(value: string) { setConfirmPassword(value); },
        handleSignUp
    })
}
