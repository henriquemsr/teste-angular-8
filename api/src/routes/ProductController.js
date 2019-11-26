module.exports = app => {
  const version = "/v1/products/";
  //declare model produto
  const products = app.src.models.products;

  const passport = app.src.libs.libs[4];

  //insert produtcs in database
  app
    .route(`${version}products`)
    .post(passport.authenticate("jwt", { session: false }), (req, res) => {
      if (
        req.body.product_name === undefined ||
        req.body.product_name === null ||
        req.body.product_name === ""
      ) {
        res.status(204).json({
          error: true,
          data: "Campo nome do produto obrigatório"
        });
      } else if (
        req.body.product_qtd === undefined ||
        req.body.product_qtd === null ||
        req.body.product_qtd === ""
      ) {
        res.status(204).json({
          error: true,
          data: "Campo qtd do produto obrigatório"
        });
      } else if (
        req.body.price === undefined ||
        req.body.price === null ||
        req.body.price === ""
      ) {
        res.status(204).json({
          error: true,
          data: "Campo price do produto obrigatório"
        });
      } else {
        const {
          product_name,
          product_qtd,
          product_saller,
          product_best_sellers,
          product_path_img,
          price,
          sales_price
        } = req.body;
        products
          .create({
            product_name: product_name,
            product_path_img: product_path_img,
            product_qtd: product_qtd,
            product_saller: product_saller,
            product_best_sellers: product_best_sellers,
            price: price,
            sales_price: sales_price
          })
          .then(resp => {
            res.status(201).json({
              error: false,
              data: resp
            });
          })
          .catch(err => {
            res.status(500).json({
              error: true,
              data: err
            });
          });
      }
    });
  //list products
  app
    .route(`${version}products`)
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
      products
        .findAndCountAll()
        .then(result => {
          if (result.count > 0) {
            res.status(200).json({
              error: false,
              data: result
            });
          } else {
            res.status(204).json({
              error: true,
              data: "Nenhum produto encontrado"
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            error: true,
            data: err
          });
        });
    });
  //list products for id
  app
    .route(`${version}products/:id`)
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
      products
        .findOne({ where: { product_id: req.params.id } })
        .then(result => {
          res.status(200).json({
            error: false,
            data: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: true,
            data: err
          });
        });
    });
  //list products for product_best_sellers
  app
    .route(`${version}productsBestSellers`)
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
      products
        .findAll({ where: { product_best_sellers: 1 } })
        .then(result => {
          res.status(200).json({
            error: false,
            data: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: true,
            data: err
          });
        });
    });
  //list products for seller
  app
    .route(`${version}productsSeller`)
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
      products
        .findAll({ where: { product_saller: 1 } })
        .then(result => {
          res.status(200).json({
            error: false,
            data: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: true,
            data: err
          });
        });
    });
  //update products for id
  app
    .route(`${version}products/:id`)
    .put(passport.authenticate("jwt", { session: false }), (req, res) => {
      products
        .findAndCountAll()
        .then(result => {
          const {
            product_name,
            product_path_img,
            product_qtd,
            status,
            product_saller,
            product_best_sellers,
            price,
            sales_price
          } = req.body;
          if (result.count > 0) {
            products
              .update(
                {
                  product_name: product_name,
                  product_path_img: product_path_img,
                  product_qtd: product_qtd,
                  status: status,
                  product_saller: product_saller,
                  product_best_sellers: product_best_sellers,
                  price: price,
                  sales_price: sales_price
                },
                { where: { product_id: req.params.id } }
              )
              .then(() => {
                res.json({
                  error: false,
                  data: "Produto atualizado com sucesso"
                });
              })
              .catch(error => {
                res.json({
                  error: true,
                  data: error
                });
              });
          } else {
            res.status(204).json({
              error: true,
              data: "Nenhum produto encontrado"
            });
          }
        })
        .catch(err => {
          res.json({
            error: true,
            data: err
          });
        });
    });
  //delete product
  app
    .route(`${version}products/:id`)
    .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
      products
        .destroy({ where: req.params.id })
        .then(() => {
          res.json({
            error: false,
            data: "Produto apagado com sucesso"
          });
        })
        .catch(error => {
          res.status(500).json({
            error: true,
            data: error
          });
        });
    });
};
