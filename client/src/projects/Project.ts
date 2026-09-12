
export interface ProjectImage {
    pageNumber: number,
    fileName: string,
}

export interface Project {
    id: string,
    name: string,
    pdfFileName: string,
    images: ProjectImage[]
}
