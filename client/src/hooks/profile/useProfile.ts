import {useEffect, useState} from 'react';
import {serverProxy} from '../../services';
import type {ProfileData} from '../../services/server/responses';

export function useProfile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;

        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await serverProxy.getProfile();
                if (!active) return;
                if (!result.ok && result.error) setError(result.error);
                setProfile(result);
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : 'Unable to load your profile.');
            } finally {
                if (active) setIsLoading(false);
            }
        }

        void load();
        return () => { active = false; };
    }, [attempt]);

    function retry() {
        setError(null);
        setIsLoading(true);
        setAttempt(value => value + 1);
    }

    return {profile, error, isLoading, retry};
}
