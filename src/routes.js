const routes = require("express").Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const Post = require("./models/Post");

routes.get('/posts', async (req, res) => {
    // const posts = await Post.find({}, {url: 1});
    const posts = await Post.find();


    return res.status(200).json(posts);
});

routes.post('/posts', multer(multerConfig).single('file'), async (req,res)=> {
    console.log(req.file);

    const {originalname: name, size, key, location: url = ""} = req.file;

    const checkUploadsNumber = await Post.countDocuments();

    //checar nuúmero de uploads do usuario
//     if(checkUploadsNumber >= 5) {
//         res.status(406).json("Número de uploads maximo é de 5");
//     }

    const post = await Post.create({
        name,
        size,
        key,
        url,
    });

   res.status(200).json(post);
});

routes.delete('/posts/:id', async (req,res) => {
    const post = await Post.findById(req.params.id);

    await post.remove();

    return res.send();
});

module.exports = routes;





















// fs.stat(path.resolve(__dirname, "..", "tmp", "uploads", "3d1d54744d238b8a18d93ed855742887-vergil.jpg"), (err, stats) => {
//     if(err) {
//         console.log(`file does not exist`);
//     } else {
//         console.log(stats)
//     }
// })
