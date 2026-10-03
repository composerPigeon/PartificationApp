import {useRef, useState} from 'react'
import type {SubmitEvent} from 'react'
import {useNavigate} from '@tanstack/react-router'
import {projectManager} from '../services'

export function useCreateProject() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const [progress, setProgress] = useState('')
    const submitting = useRef(false)

    function chooseFile(selected: File | null) {
        setError(null)
        setFile(null)
        if (!selected) return
        if (!/\.pdf$/i.test(selected.name) || !selected.size) {
            setError('Choose a non-empty PDF file.')
            return
        }
        setFile(selected)
    }

    function onPageConvertProgress(count: number, total: number): void {
        setProgress(`Saving page ${count} of ${total}…`)
    }

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submitting.current || !file || !name.trim()) return
        submitting.current = true
        setBusy(true)
        setError(null)
        setProgress('Preparing PDF…')
        try {
            await projectManager.createProject(name, file, onPageConvertProgress);
            await navigate({to: '/projects'})
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to create the project.')
        } finally {
            submitting.current = false
            setBusy(false)
            setProgress('')
        }
    }

    return {name, setName, file, chooseFile, error, busy, progress, submit}
}
