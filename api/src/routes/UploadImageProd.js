module.exports = app => {
  //declare version api
  const version = "/v1/uploadImgProd";
  //import libs
  const upload = app.src.libs.libs[5];
  const unlinkAsync = app.src.libs.libs[9];
  const passport = app.src.libs.libs[4];
  //import models
  const produtos = app.src.models.products;
  //upload image
  app
    .route(version + "/upload/:id")
    .post(
      upload[0].array("images", 10),
      passport.authenticate("jwt", { session: false }),
      (req, res, next) => {
        try {
          const arrayImg = [
            "image/jpeg",
            "image/jpg",
            "image/PNG",
            "image/png",
            "image/gif"
          ];

          if (req.files[0].bytes > 5000000) {
            res.json({
              error: true,
              message: "Tamanho do arquivo maior que o permitido"
              // resp:upload
            });
            upload[1].v2.uploader.destroy(req.files[0].public_id);
          } else if (arrayImg.includes(req.files[0].mimetype) == false) {
            res.json({
              error: true,
              message: "Formato incorreto para upload"
            });
            upload[1].v2.uploader.destroy(req.files[0].public_id);
          } else {
            produtos
              .findAndCountAll({ where: { product_id: req.params.id } })
              .then(pro => {
                if (pro.count > 0) {
                  produtos
                    .update(
                      { product_path_img: req.files[0].secure_url },
                      { where: { product_id: req.params.id } }
                    )
                    .then(() => {
                      res.status(201).json({
                        error: false,
                        data: "Foto enviada com sucesso",
                        destine: req.files[0].secure_url
                      });
                    })
                    .catch(error => {
                      res.status(500).json({
                        error: false,
                        data: error
                      });
                      unlinkAsync(req.files[0].path);
                    });
                } else {
                  res.status(200).json({
                    error: true,
                    data: "Esse produto não existe"
                  });
                  unlinkAsync(req.files[0].path);
                }
              });
          }
        } catch (error) {
          console.log(er);
        }
      }
    );
};
