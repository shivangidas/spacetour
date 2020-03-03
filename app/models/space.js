module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "space",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nasa_id: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      center: {
        type: DataTypes.STRING(256),
        allowNull: true
      },
      link: {
        type: DataTypes.STRING(256),
        allowNull: true
      },
      location: {
        type: DataTypes.STRING(256),
        allowNull: true
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
