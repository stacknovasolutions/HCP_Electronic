// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
const dotenv = require('dotenv')
dotenv.config();

let apps = [{
    name: 'hcp_backend',
    cwd: '/opt/worksapce/hcp_backend',
    script: 'dist/app.js',
    instances: 1,
    log_date_format: "YYYY-MM-DD HH:mm Z",
    autorestart: true,
    watch: false,
    max_memory_restart: '3G',
    out_file: "/var/log/pm2/hcp-out.log",
    error_file: "/var/log/pm2/hcp-err.log",
    combine_logs: true,
    env: {
        NODE_ENV: 'development',
        port: 5000
    },
}]

module.exports = {
    apps
};
