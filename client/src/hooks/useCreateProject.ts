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

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submitting.current || !file || !name.trim()) return
        submitting.current = true
        setBusy(true)
        setError(null)
        setProgress('Preparing PDF…')
        try {
            const {pdfPages} = await import('../services/projects/pdfPages.ts')
            await projectManager.createProject(name, pdfPages(file, (page, total) => {
                setProgress(`Saving page ${page} of ${total}…`)
            }))
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
