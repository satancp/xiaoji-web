let configs = {};
if (process.env.isProd) {
    configs = {
        server_url: 'http://localhost:7001/api/'
    };
} else {
    configs = {
        server_url: 'http://54.238.75.163:7001/api/'
    };
}

export default configs;
