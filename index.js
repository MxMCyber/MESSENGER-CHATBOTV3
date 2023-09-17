const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");


/////////////////////////////////////////////
//========= Check node.js version =========//
/////////////////////////////////////////////
/*
const nodeVersion = semver.parse(process.version);
if (nodeVersion.major < 13) {
    logger(`Node.js hiện tại của bạn ${process.version} không được hỗ trợ, cần Node.js 13 trở lên để có thể  khởi chạy bot!`, "error");
    return process.exit(0);
};
*/
///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const dashboard = http.createServer(function (_req, res) {
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.write("HI! THIS BOT WAS MADE BY ME(MXMTECHNOLOGY) - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯");
    res.end();
});

dashboard.listen(process.env.port || 0);

logger("Đã mở server website...", "[ Starting ]");

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

function startBot(message) {
    (message) ? logger(message, "[ Starting ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0) {
            startBot("Restarting...");
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ Starting ]");
    });
};

////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

axios.get('https://raw.githubusercontent.com/miraipr0ject/miraiv2/master/package.json').then((res) => {
    logger("Đang kiểm tra cập nhật...", "[ CHECK UPDATE ]");
    const local = JSON.parse(readFileSync('./package.json'));
    if (semver.lt(local.version, res.data.version)) {
        if (local.autoUpdate == true) {
            logger(`Đã có phiên bản ${res.data.version}, tiến hành cập nhật source code!`, "[ CHECK UPDATE ]");
            const child = spawn("node", ["update.js"], {
                cwd: __dirname,
                stdio: "inherit",
                shell: true
            });

            child.on("exit", function () { return process.exit(0) });

            child.on("error", function (error) {
                logger("Error! An error occurred. Please try again later: " + JSON.stringify(error), "[ CHECK UPDATE ]");
            });
        } else {
            logger(`Version available ${res.data.version} waiting for you to update, use "node update" command to update to the new version!`, "[ CHECK UPDATE ]");
            startBot();
        }
    }
    else {
        logger('You are using the latest version!', "[ CHECK UPDATE ]");
        startBot();
    }
}).catch(err => logger("An error occurred while checking for updates for you!", "[ CHECK UPDATE ]"));

//THIZ BOT WAS MADE BY ME(MXMTECHNOLOGY) - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
