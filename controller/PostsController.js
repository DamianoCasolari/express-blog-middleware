const posts = require("../db/postsDb")
const path = require("path")
const fs = require("fs")
const { kebabCase, indexOf } = require('lodash');

// General variable 
const pathDb = path.resolve("db/postsDb.json")


function index(req, res) {
    res.format({
        html: () => {
            const htmlContent = []
            htmlContent.push("<ul style='list-style:none'>")

            for (const post of posts) {
                const slug = post.slug
                htmlContent.push(`
                    <li>
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>`)

                if (post.image) {
                    if (typeof post.image == "string") {

                        htmlContent.push(`<img src="/imgs/posts/${post.image}" alt="Immagine del post:${post.title}">`)

                    } else {
                        htmlContent.push(` <img src="/imgs/newPosts/${post.image.filename}" alt="Immagine del post:${post.title}">`)
                    }
                }
                htmlContent.push(`
                <br>
                    <a href="/posts/${slug}">Informazioni più dettagliate</a>
                </li>`)

            }
            htmlContent.push("</ul>")
            res.send(htmlContent.join(""))

        },
        json: () => {
            res.type("json").send(posts)
        }
    })
}

function store(req, res) {

    // create dinamic ID
    const idArray = posts.map((post) => post.id)
    let maxId = Math.max(...idArray)
    maxId++

    // create dinamic slug
    let newSlug = kebabCase(req.body.title)
    const checkSlug = posts.filter((post) => post.slug == newSlug)
    if (checkSlug.length > 0) {
        newSlug = newSlug + "-" + maxId
    }

    //add extension of new imported image
    const newImgPath = path.resolve("public", "imgs", "newPosts", req.file.filename)
    fs.renameSync(newImgPath, path.join(path.dirname(newImgPath), req.file.filename + "." + path.extname(req.file.originalname)))
    req.file.filename = req.file.filename + "." + req.file.originalname.split(".")[1]


    // create a new Post
    const newPost = {
        ...req.body,
        id: maxId,
        slug: newSlug,
        image: req.file

    }
    // Add new Post to db
    posts.push(newPost)

    //overwrite the db
    fs.writeFileSync(pathDb, JSON.stringify(posts, null, 2), "utf-8")

    //split type of response based on accept request
    res.format({
        json: () => {
            const reqBody = req.body
            res.type("json").send(newPost)
        },
        html: () => {
            const homePath = process.env.APP_URL
            res.redirect(homePath)
        }
    })
}

function destroy(req, res) {
    const slug = req.params.slug
    let singlePost = posts.find((post) => post.slug == slug)

    //CHECK IF THAT SPECIFIC POST EXIST AND AFTER I REMOVE FROM DB
    if (singlePost) {

        const postsWithoutSinglePost = posts.filter((post) => post.slug != slug)
        fs.writeFileSync(pathDb, JSON.stringify(postsWithoutSinglePost, null, 2), "utf-8")

        //SPLIT OLD AND NEW POST BECAUSE HAVE DIFFENT TYPEOF AND DIFFERNET FOLDER AND DELETE ITS IMG FROM SERVER
        if (singlePost.image) {
            if (typeof singlePost.image == "string") {
                const imgPath = path.resolve("public", "imgs", "posts", singlePost.image)
                fs.unlinkSync(imgPath)
            } else {
                const imgPath = path.resolve("public", "imgs", "newPosts", singlePost.image.filename)
                fs.unlinkSync(imgPath)
            }
        }
        res.type("html").send("<h1>File eliminato correttamente</h1>")
    }
    else {

        res.type("html").send("<h1>Non risulta registrato alcun file con il nome indicato</h1>")
    }

}


function show(req, res) {
    const slug = req.params.slug
    const singlePost = posts.find((post) => {
        return post.slug == slug
    })
    console.log(singlePost);
    if (!singlePost) {
        res.type("json").send("Il post cercato non esiste")
    }
    if (singlePost.image) {
        if (typeof singlePost.image == "string") {
            singlePost.image_url = process.env.APP_URL + "/imgs/posts/" + singlePost.image
            singlePost.image_download_url = process.env.APP_URL + `/posts/${singlePost.slug}/download`

        } else {
            singlePost.image_url = process.env.APP_URL + "/imgs/newPosts/" + singlePost.image.filename
            singlePost.image_download_url = process.env.APP_URL + `/posts/${singlePost.slug}/download`
        }
    }

    res.type("json").send(singlePost)
}

function create(req, res) {
    res.format({
        html: () => {
            res.type("html").send("<div class='create_container'><h1>Creazione nuovo post</h1></div>")
        },
        default: () => {
            res.type("html").send("<div class='create_container'>ERRORE 406 - Creazione del file non riuscita</div>")
        }
    })
}

function download(req, res) {
    const slug = req.params.slug
    const singlePost = posts.find((post) => {
        return post.slug == slug
    })
    if (!singlePost) {
        res.send("ERRORE 404 - File non registrato nei nostri database")
    }

    if (typeof singlePost.image == "string") {
        const postSlugNoSlash = encodeURIComponent(singlePost.image)
        const imgPath = path.resolve(__dirname, "..", "public", "imgs", "posts", postSlugNoSlash)
        res.download(imgPath)
    } else {
        const postSlugNoSlash = encodeURIComponent(singlePost.image.filename)
        const imgPath = path.resolve(__dirname, "..", "public", "imgs", "newPosts", postSlugNoSlash)
        res.download(imgPath)
    }
}

module.exports = {
    index,
    show,
    create,
    download,
    store,
    destroy
}