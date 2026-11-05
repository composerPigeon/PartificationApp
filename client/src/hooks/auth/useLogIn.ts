import {useNavigate} from "@tanstack/react-router";
import {useState, type SubmitEvent} from "react";
import {serverProxy} from "../../services";
import {useAuth} from './useAuth';
import type {FormBaseState} from "../states/FormBaseState.ts";


export interface LoginState extends FormBaseState {
    get userName(): string,
    set userName(value: string),

    get password(): string,
    set password(value: string),

    handleLogin: (event: SubmitEvent<HTMLFormElement>) => Promise<void>,
}

export function useLogIn(): LoginState {
    const {addAccount, authenticate} = useAuth();
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (isSubmitting) return
        setError(null)
        setIsSubmitting(true)

        try {
            const result = await serverProxy.executeLogin(userName.trim().toLowerCase(), password)

            if (!result.ok) {
                setError(result.error ?? 'Unable to log in. Please try again.')
                return
            }

            addAccount(result.userId, result.userName)
            authenticate(result.userId)
            await navigate({to: '/projects'})
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to log in. Please try again.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        get userName() { return userName; },
        set userName(value: string) { setUserName(value); },
        get password() { return password; },
        set password(value: string) { setPassword(value); },
        handleLogin,
        get error() { return error; },
        set error(value: string | null) { setError(value); },
        get isSubmitting() { return isSubmitting; },
        set isSubmitting(value: boolean) { setIsSubmitting(value); },
        get isIncomplete() { return !userName.trim() || !password; },
    }
}
