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
                    <p>${post.content}</p>
                    <img src="/imgs/posts/${post.image}" alt="Immagine del post : ${post.title}">
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

    // create a new Post
    const newPost = {
        ...req.body,
        id: maxId,
        slug: newSlug

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

function destroy(req,res){
const slug = req.params.slug
let checkSlug = posts.filter((post)=> post.slug == slug )
if(checkSlug.length > 0){
    checkSlug = posts.filter((post)=> post.slug != slug )
    fs.writeFileSync(pathDb,JSON.stringify(checkSlug, null, 2), "utf-8" )
    res.type("html").send("<h1>File eliminato correttamente</h1>")
} else {
    res.type("html").send("<h1>Non risulta registrato alcun file con il nome indicato</h1>")
}

}


function show(req, res) {
    const slug = req.params.slug
    const singlePost = posts.filter((post) => {
        return post.slug == slug
    })
    if (singlePost.length == 0) {
        res.type("json").send("Il post cercato non esiste")
    }
    singlePost[0].image_url = process.env.APP_URL + "/imgs/posts/" + singlePost[0].image
    //oppure => singlePost[0].image_url = req.protocol + ":" + req.get('host') + "/imgs/posts/" + singlePost[0].image
    singlePost[0].image_download_url = process.env.APP_URL + `/posts/${singlePost[0].slug}/download`
    // oppure => singlePost[0].image_download_url = req.protocol + ":" + req.get('host') + `/posts/${singlePost[0].slug}/download` 

    res.type("json").send(singlePost[0])
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
    const singlePost = posts.filter((post) => {
        return post.slug == slug
    })
    if (singlePost.length == 0) {
        res.send("ERRORE 404 - File non registrato nei nostri database")
    }
    const postSlugNoSlash = encodeURIComponent(singlePost[0].image)
    const imgPath = path.resolve(__dirname, "..", "public", "imgs", "posts", postSlugNoSlash)

    console.log(imgPath);
    res.download(imgPath)

}

module.exports = {
    index,
    show,
    create,
    download,
    store,
    destroy
}