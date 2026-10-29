import {Account} from '../../domain/Account';
import {RootMetadata} from '../../domain/metadata/RootMetadata';
import type {StorageService} from '../storage/StorageService';
import {AuthorisationService} from './AuthorisationService';

export async function initializeAuthorisationService(storage: StorageService): Promise<AuthorisationService> {
    let metadata: RootMetadata;
    try {
        metadata = await storage.loadRootMetadata();
    } catch (error) {
        if (!(error instanceof Error) || !(error.cause instanceof DOMException)
            || error.cause.name !== 'NotFoundError') throw error;
        const guest = new Account(crypto.randomUUID(), 'Guest', false);
        metadata = new RootMetadata(guest, []);
        await storage.saveRootMetadata(metadata);
    }

    if (!metadata.guest?.userId || !Array.isArray(metadata.accounts)) {
        throw new Error('Invalid root metadata.');
    }
    metadata.guest.isAuthenticated = false;
    for (const account of metadata.accounts) account.isAuthenticated = false;
    return AuthorisationService.fromMetadata(metadata);
}
