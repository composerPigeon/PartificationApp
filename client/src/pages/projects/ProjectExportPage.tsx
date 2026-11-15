import {ExportSectionNavigation} from '../../components/projects/ProjectSectionNavigation';
import {Box, Container} from '@mui/material';
import {ExportToolBar} from '../../components/projects/ExportToolBar';
import {InstrumentsBar} from '../../components/projects/InstrumentsBar';
import {useProject} from '../../hooks/project';
import {ExportPageNavigation} from '../../components/projects/PageNavigation';
import {ProjectPage} from '../../components/projects/ProjectPage';
import {ExportPreview} from '../../components/projects/ExportPreview';
import {ExportProvider} from '../../components/projects/ExportProvider';
import {ExportPdfProvider} from '../../components/projects/ExportPdfProvider';
import {ExportUnsavedChangesDialog} from '../../components/projects/UnsavedChangesDialog';

export default function ProjectExportPage() {
    return <ExportProvider><ExportPdfProvider><ExportContent/></ExportPdfProvider></ExportProvider>;
}

function ExportContent() {
    const {project} = useProject();
    return <ProjectPage sectionNavigation={<ExportSectionNavigation/>} navigation={<ExportPageNavigation color="secondary"/>} title="Export" projectTitle={project.projectName}>
        <ExportUnsavedChangesDialog/>
        <Box sx={{flex: 1, py: 1, px: {xs: '64px', sm: '88px'}}}>
            <ExportToolBar/>
            <Container maxWidth="lg" disableGutters>
                <Box sx={{display: 'flex', justifyContent: 'center', pb: 2}}>
                    <Box sx={{width: '100%', maxWidth: 1104, display: 'grid', gridTemplateColumns: 'clamp(64px, 12vw, 144px) minmax(0, 800px) clamp(64px, 12vw, 144px)', gap: 1}}>
                        <Box component="section" aria-label="Export PDF viewer" data-editing-mode="select"
                             sx={{gridColumn: 2, gridRow: 1, minWidth: 0, display: 'grid', alignContent: 'start', justifyItems: 'center'}}>
                            <ExportPreview/>
                        </Box>
                        <InstrumentsBar/>
                    </Box>
                </Box>
            </Container>
        </Box>
    </ProjectPage>;
}
