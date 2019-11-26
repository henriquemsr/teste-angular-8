const Sequelize = require("sequelize");

module.exports = sequelize => {
  const ProductsModel = sequelize.src.connection.db[1].define(
    "products",
    {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_name: {
        type: Sequelize.STRING(200)
      },
      product_description: {
        type: Sequelize.STRING(255)
      },
      id_brand: {
        type: Sequelize.INTEGER(11),
      },
      id_category: {
        type: Sequelize.INTEGER(11),
      },
      product_path_img: {
        type: Sequelize.STRING(200)
      },
      product_qtd: {
        type: Sequelize.INTEGER(11)
      },
      date_create: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1
      },
      product_saller: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      product_best_sellers: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      price: {
        type: Sequelize.DOUBLE
      },
      sales_price: {
        type: Sequelize.DOUBLE
      }
    },
    {
      timestamps: false
    }
  );
  //ProductsModel.sync({ force: true })
  return ProductsModel;
};
