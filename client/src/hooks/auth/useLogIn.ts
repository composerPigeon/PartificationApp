import {useNavigate} from "@tanstack/react-router";
import {useState, type SubmitEvent} from "react";
import {serverProxy} from "../../services";
import {useAuthState} from './useAuthState';
import type {LogInState} from './states';
import {useView} from '../useView';
import {useSubmitting} from '../form';


export function useLogIn(): LogInState {
    const {addAccount, authenticate} = useAuthState();
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const view = useView()
    const submitting = useSubmitting()

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        await submitting.submit(async () => {
            const result = await serverProxy.executeLogin(userName.trim().toLowerCase(), password)

            if (!result.ok) {
                view.error = result.error ?? 'Unable to log in. Please try again.'
                return
            }

            addAccount(result.userId, result.userName)
            authenticate(result.userId)
            await navigate({to: '/project'})
        }, 'Unable to log in. Please try again.')
    }

    return {
        get isIncomplete() { return !userName.trim() || !password; },
        get userName() { return userName; },
        set userName(value: string) { setUserName(value); },
        get password() { return password; },
        set password(value: string) { setPassword(value); },
        handleSubmit,
    }
}
