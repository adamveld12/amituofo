export default {
    SENTRY_URL: '',
    SENTRY_OPTS: {
        release: 'dev',
        environment: __DEV__ ? 'development' : 'production',
    }
}
