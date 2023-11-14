// const { text } = require("body-parser")
const posts = require("../db/postsDb")
const path = require("path")


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

function show(req, res) {
    const slug = req.params.slug
    const singlePost = posts.filter((post) => {
        return post.slug == slug
    })
    if (singlePost.length == 0) {
        res.type("json").send("Il post cercato non esiste")
    }
    singlePost[0].image_url = "/imgs/posts/" + singlePost[0].image
    singlePost[0].image_download_url = `/posts/${singlePost[0].slug}/download` 

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
    const imgPath = path.resolve(__dirname , ".." ,"public" , "imgs" , "posts" , postSlugNoSlash) 

    console.log(imgPath);
    res.download(imgPath)

}

module.exports = {
    index,
    show,
    create,
    download
}