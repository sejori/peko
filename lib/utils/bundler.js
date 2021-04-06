export const bundle = async (url, output) => {
    console.log(url, output)

    return await Deno.run({
        cmd: ["deno", "bundle", url, output]
    })
}