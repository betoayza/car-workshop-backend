import { Router } from "express";
import mongoose from "mongoose";
import CarModel from "../models/carModel.js";
import ClientModel from "../models/clientModel.js";
import ServiceModel from "../models/serviceModel.js";

const router = Router();

//router for  list with all cars with more 3 years old and just 1 service done
router.get("/cars/search/lists/carlist1", async (req, res) => {
  try {
    //filter car fabrication year < 2017  ( =< 4 years)
    const list1 = await CarModel.find({ year: { $lt: 2017 } }); //.exec()
    //.then( res => {
    console.log("Coches menos de 4 años: ", list1);
    //filter ids
    const ids_array = list1.map((obj) => obj._id.toString());
    console.log("Ids de coches encontrados:", ids_array);
    //filtrar los servicios que tienen los id coches filtrados
    const services = await ServiceModel.find({ carID: { $in: ids_array } });
    console.log("Servicios: ", services);
    //obtener ids de los coches de los servicios
    const array_aux = services.map((obj) => obj.carID);
    console.log("IDs de autos resultantes: ", array_aux);
    //Eliminar los duplicados mediante un Set
    const setCarIDs = new Set(array_aux);
    console.log("Resultado aux: ", setCarIDs);
    //re-convvertir el set a array
    const array_cars_founded = [...setCarIDs].map((elem) => {
      const elem2 = mongoose.Types.ObjectId(elem);
      return elem2;
    });
    console.log("Resultado casi final: ", array_cars_founded);
    //resyltado final
    const result = await CarModel.find({ _id: { $in: array_cars_founded } });
    console.log("Resultado final: ", result);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

router.get("/cars/search/brand-model", (req, res) => {
  const { brand, model } = req.query;
});

router.post("/cars/add", async (req, res) => {
  try {
    console.log(req.body);
    const newCar = new CarModel(req.body);
    let doc = await newCar.save(); //La coleccion ya está incluida en la definicion del modelo Car
    console.log(doc);
    if (doc) {
      res.json(doc);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.log("El error es: ", error);
  }
});

router.delete("/cars/delete/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await CarModel.findOne({ code }).exec();
    if (doc) {
      doc.status = "Inactive";
      doc = await doc.save();
      res.json(doc);
    } else res.json(null);
  } catch (error) {
    console.error(error);
  }
});

router.get("/cars/search/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    console.log(code);
    let doc = await CarModel.findOne({ code }).exec();
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.error(error);
  }
});

router.put("/cars/modify/edit", async (req, res) => {
  try {
    const { code, patent, brand, model, year, owner } = req.body.form;
    const doc = await CarModel.findOne({ code }).exec();
    doc.patent = patent;
    doc.brand = brand;
    doc.model = model;
    doc.year = year;
    doc.owner = owner;
    const doc2 = await doc.save();
    console.log("Data updated!: ", doc2);
    res.json(doc2);
  } catch (error) {
    console.error(error);
  }
});

//Sigup just exists for Admins
router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { id, email, username } = req.body;
    //validate user
    let doc = await ClientModel.find({
      $or: [{ id }, { email }, { username }],
    });
    if (!doc.length) {
      //add admin
      const newUser = new ClientModel(req.body);
      doc = await newUser.save();
      console.log("*", doc);
      res.json(doc);
    } else {
      res.json({});
    }
  } catch (error) {
    console.log(error);
  }
});
//-----------------CLIENTS
router.post("/clients/add", async (req, res) => {
  try {
    console.log(req.body);
    const { code, id, email } = req.body;
    const newClient = new ClientModel(req.body);
    let doc = await ClientModel.find({ $or: [{ code }, { id }, { email }] });
    //Si no hay coincidencias, efectua el alta
    if (!doc.length) {
      doc = await newClient.save();
      res.json(doc);
    } else {
      //si hay coincidencias, no se da el alta
      res.json({});
    }
  } catch (error) {
    console.error(error);
  }
});

router.delete("/clients/delete/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await ClientModel.findOne({ code }).exec();
    if (doc) {
      doc.status = "Inactive";
      doc = await doc.save();
      res.json(doc);
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/clients/search/:code", async (req, res) => {
  try {
    console.log(req.params.code);
    const code = req.params.code;
    let doc = await ClientModel.findOne({ code }).exec();
    res.json(doc);
  } catch (error) {
    console.error(error);
  }
});

router.put("/clients/modify", async (req, res) => {
  console.log(req.body);
  const { code, id, name, surname, email, phone } = req.body;
  let doc = await ClientModel.findOne({ code }).exec();
  if (doc) {
    doc.id = id;
    doc.name = name;
    doc.surname = surname;
    doc.email = email;
    doc.phone = phone;
    doc = await doc.save();
    res.json(doc);
  } else {
    res.json(null);
  }
});

export default router;
