import {useNavigate} from "@tanstack/react-router";
import {useState, type SubmitEvent} from "react";
import {serverProxy} from "../../services";
import {useAuth} from './useAuth';
import type {LogInState} from "./states/LogInState.ts";
import {useFormBase} from '../useFormBase.ts';


export function useLogIn(): LogInState {
    const {addAccount, authenticate} = useAuth();
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const form = useFormBase()
    form.isIncomplete = !userName.trim() || !password

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
            await navigate({to: '/projects'})
        }, 'Unable to log in. Please try again.')
    }

    return form.extend({
        get userName() { return userName; },
        set userName(value: string) { setUserName(value); },
        get password() { return password; },
        set password(value: string) { setPassword(value); },
        handleLogIn,
    })
}
