const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const Post = require('../db/posts')
const { eAdmin } = require('../helpers/eAdmin')

//config bodyparser
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//estatic
router.use(express.static('public'));
router.use(express.static('node_modules'))

//formulario posts
router.get('/post', eAdmin, (req, res) => res.render('pages/formPost'))

router.post('/add', eAdmin, (req, res) => {
    var erros = []

    if (!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: "Titulo Invalido" })
    }

    if (!req.body.texto || req.body.texto == undefined || req.body.texto == null) {
        erros.push({ texto: "Texto Invalido" })
    }

    if (!req.body.descricao || req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: "Descricao Invalida" })
    }

    if (req.body.titulo.length < 2) {
        erros.push({ texto: "Titulo muito curto" })
    }

    if (req.body.descricao.length < 10 || req.body.descricao.length > 200) {
        erros.push({ texto: "Descrição deve ter entre 10 a 180 caracteres" })
    }

    if (req.body.texto.length < 10) {
        erros.push({ texto: "Texto muito curto" })
    }

    if (erros.length > 0) {
        res.render('pages/formPost', { erros: erros })
    } else {
        Post.create({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            texto: req.body.texto,
            imagem: req.body.imagem
        }).then(() => {
            req.flash("success_msg", "Post criado com sucesso")
            res.redirect('/')
            console.log('Post criado com sucesso'
            )
        }).catch((erro) => {
            req.flash("error_msg", "Falha ao criar o Post")
            res.redirect('home/posts')
            console.log('Falha ao criar o post' + erro)
        }
        )
    }
}

)

// delete post
router.get('/delete/:id', eAdmin, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        req.flash('success_msg', 'Post deletado com sucesso!')
        res.redirect('/'),
            console.log("Done");
    }).catch((erro) => {
        req.flash('error_msg', 'Falha ao excluir o post, tente novamente!')
        res.send('Erro' + erro);
    })
})

module.exports = router