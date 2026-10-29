import {useNavigate} from "@tanstack/react-router";
import {useState, type SubmitEvent} from "react";
import {serverProxy} from "../../services";
import {useAuth} from './useAuth';
import type {PropertyState} from "../states/PropertyState.ts";
import type {FormBaseState} from "../states/FormBaseState.ts";


export interface LoginState extends FormBaseState {
    userName: PropertyState<string>,
    password: PropertyState<string>,

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
        userName: {value: userName, set: setUserName},
        password: {value: password, set: setPassword},
        handleLogin,
        error: {value: error, set: setError},
        isSubmitting: {value: isSubmitting, set: setIsSubmitting},
        isIncomplete: false,
    }
}
