import {useNavigate} from "@tanstack/react-router";
import {useState, type SubmitEvent} from "react";
import {serverProxy} from "../../services";
import {useAuthState} from './useAuthState';
import type {LogInState} from './states';
import {useInitFormBase, useInitViewState} from '..';


export function useLogIn(): LogInState {
    const {addAccount, authenticate} = useAuthState();
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const form = useInitFormBase(useInitViewState(), !userName.trim() || !password)

    async function handleLogIn(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        await form.submit(async () => {
            const result = await serverProxy.executeLogin(userName.trim().toLowerCase(), password)

            if (!result.ok) {
                form.error = result.error ?? 'Unable to log in. Please try again.'
                return
            }

            addAccount(result.userId, result.userName)
            authenticate(result.userId)
            await navigate({to: '/project'})
        }, 'Unable to log in. Please try again.')
    }

    return {
        get error() { return form.error; },
        set error(value: string | null) { form.error = value; },
        get isSubmitting() { return form.isSubmitting; },
        set isSubmitting(value: boolean) { form.isSubmitting = value; },
        get isIncomplete() { return form.isIncomplete; },
        get userName() { return userName; },
        set userName(value: string) { setUserName(value); },
        get password() { return password; },
        set password(value: string) { setPassword(value); },
        handleLogIn,
    }
}
