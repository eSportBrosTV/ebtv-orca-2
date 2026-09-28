const path = require("path")
const { execFileSync } = require("child_process")
const { version, config } = require("../package.json")

const tags = [`${config.image}:${version}`, `${config.image}:latest`]

const docker = (args) => execFileSync("docker", args, { stdio: "inherit" })

const actions = {
    build: () => docker(["build", ...tags.flatMap(tag => ["-t", tag]), path.join(__dirname, "..")]),
    push: () => tags.forEach(tag => docker(["push", tag]))
}

const action = actions[process.argv[2]]

if (!action) {
    console.error("[Docker] Usage : node scripts/docker.js <build|push>")
    process.exit(1)
}

try {
    console.log(`[Docker] ${process.argv[2]} : ${tags.join(", ")}`)

    action()
} catch (error) {
    process.exit(error.status ?? 1)
}
