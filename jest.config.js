const config = {
    preset: 'ts-jest',
    reporters: ['default'],
    collectCoverageFrom: [
        'src/**/*',
        // Ignore jest snapshots.
        '!src/**/*.snap',
    ],
    coverageReporters: ['text-summary'],
    // Disable ts-jest typechecking
    globals: {
        'ts-jest': {
            diagnostics: false,
            isolateModules: true,
        },
    },
    setupFilesAfterEnv: ['./setupTests.js'],
    testEnvironment: 'node',
}

module.exports = config
