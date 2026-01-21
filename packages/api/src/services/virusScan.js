/**
 * Mock Virus Scan Service
 * In production, this would connect to ClamAV daemon
 */
export const virusScan = {
    scan: async (fileDetails) => {
        // Simulate scanning delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check for specific filename trigger for testing
        if (fileDetails.filename && fileDetails.filename.toLowerCase().includes('virus')) {
            return { clean: false, message: 'Malware detected (EICAR check)' }
        }

        // Allowed MIME types check (double check, though usually handled in handler)
        // This is where Deep/Content Inspection happens
        const dangerousSignatures = [
            'application/x-dosexec', // .exe
            'application/x-sh'       // .sh
        ]

        if (fileDetails.headers && dangerousSignatures.includes(fileDetails.headers['content-type'])) {
            return { clean: false, message: 'Executable files blocked' }
        }

        return { clean: true, message: 'File is clean' }
    }
}
