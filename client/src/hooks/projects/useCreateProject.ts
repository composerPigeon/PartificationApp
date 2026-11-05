import {useState} from 'react'
import type {SubmitEvent} from 'react'
import {useNavigate} from '@tanstack/react-router'
import {projectManager} from '../../services'
import {useFormBase} from '../useFormBase.ts'
import type {CreateProjectState} from './states/CreateProjectState.ts'

export function useCreateProject(): CreateProjectState {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [author, setAuthor] = useState('')
    const [authorDate, setAuthorDate] = useState('')
    const [genre, setGenre] = useState('')
    const [allowLayoutModelTraining, setAllowLayoutModelTraining] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState('')
    const form = useFormBase()
    form.isIncomplete = !file || !name.trim() || !title.trim()

    function onPageConvertProgress(count: number, total: number): void {
        setProgress(`Saving page ${count} of ${total}…`)
    }

    async function handleCreateProject(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!file || form.isIncomplete) return
        await form.submit(async () => {
            setProgress('Preparing PDF…')
            try {
                await projectManager.createProject(name, file, onPageConvertProgress, {
                    title, subtitle, author, authorDate, genre,
                }, allowLayoutModelTraining);
                await navigate({to: '/projects'})
            } finally {
                setProgress('')
            }
        }, 'Unable to create the project.')
    }

    return form.extend({
        get name() { return name; },
        set name(value: string) { setName(value); },
        get title() { return title; },
        set title(value: string) { setTitle(value); },
        get subtitle() { return subtitle; },
        set subtitle(value: string) { setSubtitle(value); },
        get author() { return author; },
        set author(value: string) { setAuthor(value); },
        get authorDate() { return authorDate; },
        set authorDate(value: string) { setAuthorDate(value); },
        get genre() { return genre; },
        set genre(value: string) { setGenre(value); },
        get allowLayoutModelTraining() { return allowLayoutModelTraining; },
        set allowLayoutModelTraining(value: boolean) { setAllowLayoutModelTraining(value); },
        get file() { return file; },
        set file(selected: File | null) {
            form.error = null
            if (selected && (!/\.pdf$/i.test(selected.name) || !selected.size)) {
                setFile(null)
                form.error = 'Choose a non-empty PDF file.'
                return
            }
            setFile(selected)
        },
        get progress() { return progress; },
        handleCreateProject,
    })
}
